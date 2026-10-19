"""Bounded, deterministic matrix analyses; no inferred participant identities."""
import numpy as np
from scipy.optimize import least_squares, minimize, nnls
from scipy.spatial.distance import cdist, pdist, squareform
from extended import table


def distance_matrix(value):
    matrix=np.asarray(value,dtype=float)
    if matrix.ndim!=2 or matrix.shape[0]!=matrix.shape[1] or not 3<=len(matrix)<=60 or not np.isfinite(matrix).all() or np.any(matrix<0):
        raise ValueError('Нужна квадратная матрица 3–60 объектов с конечными неотрицательными значениями.')
    if not np.allclose(matrix,matrix.T,atol=1e-10,rtol=0) or not np.allclose(np.diag(matrix),0,atol=1e-10,rtol=0):
        raise ValueError('Матрица различий должна быть симметричной с нулевой диагональю.')
    if np.max(matrix)==0:raise ValueError('Все различия равны нулю.')
    return matrix


def gram(matrix):
    h=np.eye(len(matrix))-np.ones_like(matrix)/len(matrix)
    return -.5*h@(matrix**2)@h


def calculate_matrix(request,out):
    method=request['method'];dimension=int(request.get('parameters',{}).get('components',2))
    if dimension not in [1,2,3]:raise ValueError('Размерность должна быть от одной до трёх.')
    raw=request.get('matrixData');rng=np.random.default_rng(20261020)
    out['steps']=['Матрицы введены явно; порядок объектов задан источником. Пропуски не подставляются.', 'Seed=20261020; координаты определяются с точностью до допустимых преобразований пространства.']
    if method=='cluster_matrix':
        from scipy.cluster.hierarchy import linkage,fcluster
        matrix=distance_matrix(raw);clusters=int(request.get('parameters',{}).get('clusters',2));algorithm=int(request.get('parameters',{}).get('linkage',2))
        if not 2<=clusters<len(matrix) or algorithm not in range(4):raise ValueError('Проверьте число кластеров и способ объединения.')
        tree=linkage(squareform(matrix,checks=False),method=['single','complete','average','weighted'][algorithm]);membership=fcluster(tree,t=clusters,criterion='maxclust')
        table(out,'Кластеры',['Объект','Кластер'],[[i+1,int(c)] for i,c in enumerate(membership)])
        table(out,'Агломерация',['Новый узел','Узел 1','Узел 2','Расстояние','Размер'],[[len(matrix)+i+1,int(a)+1,int(b)+1,d,int(count)] for i,(a,b,d,count) in enumerate(tree)])
        out['formula']='Иерархическая агломерация заданных различий; связь '+['single','complete','average','weighted'][algorithm]+'; разрез maxclust'
    elif method in ['mds_matrix_classical','mds_matrix_nonmetric']:
        matrix=distance_matrix(raw)
        if dimension>=len(matrix):raise ValueError('Размерность должна быть меньше числа объектов.')
        if method=='mds_matrix_classical':
            eigen,vectors=np.linalg.eigh(gram(matrix));order=np.argsort(eigen)[::-1];eigen=eigen[order];vectors=vectors[:,order]
            if eigen[dimension-1]<=1e-12:raise ValueError('Недостаточно положительных собственных значений для выбранной размерности.')
            coordinates=vectors[:,:dimension]*np.sqrt(eigen[:dimension])
            table(out,'Собственные значения',['Ось','Значение'],[[i+1,v] for i,v in enumerate(eigen)])
            if np.min(eigen)<-1e-8:out['warnings'].append('Есть отрицательные собственные значения: матрица не является евклидовой; показана аппроксимация по положительным осям.')
            out['formula']='B=−½HD²H; H=I−11ᵀ/n; X=V₊√Λ₊'
        else:
            from sklearn.manifold import MDS
            import sklearn
            out.setdefault('packages',{})['scikit-learn']=sklearn.__version__
            if np.any(matrix[np.triu_indices(len(matrix),1)]==0):raise ValueError('Вне диагонали нужны положительные различия: нули в неметрическом алгоритме означают пропуски.')
            fit=MDS(n_components=dimension,metric_mds=False,init='random',metric='precomputed',n_init=4,max_iter=1000,eps=1e-6,random_state=20261020,normalized_stress=True)
            coordinates=fit.fit_transform(matrix)
            if fit.n_iter_>=1000:raise ValueError('Неметрический алгоритм не сошёлся за 1000 итераций.')
            table(out,'Сходимость',['Показатель','Значение'],[['Stress-1',fit.stress_],['Итераций',fit.n_iter_]])
            out['formula']='Stress-1=√[Σ(d−d̂)²/Σd²]; монотонная калибровка различий, SMACOF'
        table(out,'Координаты объектов',['Объект']+[str(i+1) for i in range(dimension)],[[i+1]+list(row) for i,row in enumerate(coordinates)])
    elif method=='mds_individual':
        matrices=[distance_matrix(matrix) for matrix in raw]
        if not 2<=len(matrices)<=10 or len({m.shape for m in matrices})!=1 or len(matrices[0])>25:
            raise ValueError('INDSCAL: нужны 2–10 матриц одинакового размера, до 25 объектов.')
        grams=np.stack([gram(m) for m in matrices]);n=len(matrices[0])
        if dimension>=n:raise ValueError('Размерность должна быть меньше числа объектов.')
        eigen,vectors=np.linalg.eigh(grams.mean(axis=0));base=vectors[:,-dimension:]
        best=None
        for start in range(3):
            coordinates=base.copy() if start==0 else rng.normal(size=(n,dimension))
            previous=np.inf;converged=False
            for iteration in range(300):
                coordinates-=coordinates.mean(axis=0);norm=np.linalg.norm(coordinates,axis=0)
                if np.any(norm<1e-10):break
                coordinates/=norm
                design=np.column_stack([np.outer(coordinates[:,j],coordinates[:,j]).ravel() for j in range(dimension)])
                weights=np.array([nnls(design,b.ravel())[0] for b in grams])
                def objective(flat):
                    x=flat.reshape(n,dimension);estimated=np.einsum('ij,sj,kj->sik',x,weights,x);residual=estimated-grams
                    gradient=4*np.einsum('sik,kj,sj->ij',residual,x,weights)
                    return np.sum(residual**2),gradient.ravel()
                fit=minimize(objective,coordinates.ravel(),jac=True,method='L-BFGS-B',options={'maxiter':50,'ftol':1e-12,'gtol':1e-7})
                coordinates=fit.x.reshape(n,dimension);loss=float(fit.fun)
                if abs(previous-loss)<=1e-9*max(1,previous if np.isfinite(previous) else 1):converged=True;break
                previous=loss
            if converged and (best is None or loss<best[0]):best=(loss,coordinates.copy(),weights.copy(),iteration+1)
        if best is None:raise ValueError('INDSCAL не сошёлся. Уменьшите размерность или проверьте матрицы.')
        loss,coordinates,weights,iterations=best
        norm=np.linalg.norm(coordinates-coordinates.mean(axis=0),axis=0);coordinates=(coordinates-coordinates.mean(axis=0))/norm;weights=weights*norm**2
        strain=np.sqrt(loss/np.sum(grams**2))
        table(out,'Общая конфигурация',['Объект']+[str(i+1) for i in range(dimension)],[[i+1]+list(row) for i,row in enumerate(coordinates)])
        table(out,'Индивидуальные веса',['Матрица']+[str(i+1) for i in range(dimension)],[[i+1]+list(row) for i,row in enumerate(weights)])
        table(out,'Сходимость',['Показатель','Значение'],[['Нормированный strain',strain],['Итераций ALS',iterations],['Стартов',3]])
        out['formula']='B_s=−½HD_s²H; min Σ_s ||B_s−X diag(w_s)Xᵀ||²_F; w_s≥0; центрированные единичные столбцы X'
        out['warnings'].append('Локальная минимизация strain скалярных произведений, не Stress-1 расстояний. Оси и веса не являются психологическими диагнозами.')
    elif method=='mds_preference':
        matrix=np.asarray(raw,dtype=float)
        if matrix.ndim!=2 or min(matrix.shape)<3 or max(matrix.shape)>25 or not np.isfinite(matrix).all() or np.any(matrix<0) or not np.any(matrix>0):
            raise ValueError('Unfolding: нужна прямоугольная матрица 3–25 строк и столбцов с неотрицательными различиями.')
        n,m=matrix.shape;scale=np.sqrt(np.mean(matrix**2));target=matrix/scale;best=None
        for start in range(4):
            initial=rng.normal(scale=.5,size=(n+m,dimension))
            def residual(flat):
                coordinates=flat.reshape(n+m,dimension)
                return (cdist(coordinates[:n],coordinates[n:])-target).ravel()
            fit=least_squares(residual,initial.ravel(),max_nfev=1000,ftol=1e-8,xtol=1e-8,gtol=1e-8)
            if fit.success and (best is None or fit.cost<best.cost):best=fit
        if best is None:raise ValueError('Развёртывание не сошлось за заданное число итераций.')
        coordinates=best.x.reshape(n+m,dimension);coordinates=(coordinates-coordinates.mean(axis=0))*scale
        stress=np.sqrt(np.sum(best.fun**2)/np.sum(target**2))
        table(out,'Координаты участников',['Строка']+[str(i+1) for i in range(dimension)],[[i+1]+list(row) for i,row in enumerate(coordinates[:n])])
        table(out,'Координаты объектов',['Столбец']+[str(i+1) for i in range(dimension)],[[i+1]+list(row) for i,row in enumerate(coordinates[n:])])
        table(out,'Качество модели',['Показатель','Значение'],[['Нормированный стресс',stress],['Вычислений функции · лучший старт',best.nfev],['Стартов',4]])
        out['formula']='min Σᵢⱼ(||uᵢ−vⱼ||−δᵢⱼ)²; нормированный стресс=√[Σ residual²/Σδ²]'
        out['warnings'].append('Метрическое unfolding: меньшие входные значения означают большую близость/предпочтение. Глобальный минимум не гарантируется; повороты и отражения эквивалентны.')
    else:
        raise ValueError('Неизвестный матричный метод.')
    return out
