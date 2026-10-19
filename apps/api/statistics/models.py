"""Whitelisted models; labels are never evaluated as Python or model expressions."""
import numpy as np
from scipy import stats
from scipy.spatial.distance import pdist, squareform
from scipy.cluster.hierarchy import linkage, fcluster
from statsmodels.stats.multitest import multipletests
from extended import aligned, nonconstant, table


def calculate_model(request, arrays, out):
    import statsmodels.api as sm
    import statsmodels
    import sklearn
    from sklearn.preprocessing import StandardScaler
    out['packages']={'statsmodels':statsmodels.__version__,'scikit-learn':sklearn.__version__}
    method=request['method'];alpha=request.get('alpha',.05);params=request.get('parameters',{})
    data=aligned(arrays);n,k=data.shape;labels=[g['label'] for g in request['groups']]
    if method.startswith('difference_'):
        if k!=4 or not 10<=n<=1000:raise ValueError('Для парного bootstrap нужны четыре показателя и 10–1000 полных наблюдений.')
        coefficient={'difference_pearson':stats.pearsonr,'difference_spearman':stats.spearmanr,'difference_kendall':stats.kendalltau}[method]
        def delta(values):return float(coefficient(values[:,0],values[:,1]).statistic-coefficient(values[:,2],values[:,3]).statistic)
        observed=delta(data);rng=np.random.default_rng(20261020);distribution=[]
        for _ in range(1999):
            sample=data[rng.integers(0,n,n)]
            if any(np.ptp(sample[:,i])==0 for i in range(4)):raise ValueError('В bootstrap возник постоянный показатель: недостаточно разнообразия для устойчивого сравнения.')
            distribution.append(delta(sample))
        distribution=np.array(distribution);ci=np.quantile(distribution,[alpha/2,1-alpha/2])
        p=(1+np.sum(np.abs(distribution-observed)>=abs(observed)))/(len(distribution)+1)
        out.update(statistic=observed,statisticLabel='Δ связи',p=float(p),effect=observed,effectLabel='Первая связь − вторая связь',ci=ci.tolist(),ciLabel='Percentile bootstrap ДИ',formula='Δ=r(X₁,X₂)−r(X₃,X₄); совместная перевыборка строк; p≈P*(|Δ*−Δ|≥|Δ|)')
        out['steps'].append('1999 парных bootstrap-повторов, seed=20261020; центрированный двусторонний p с поправкой +1, percentile-ДИ.')
        out['warnings'].append('Bootstrap-p приближённый; не является точным перестановочным критерием. Сопоставление двух отдельных p не используется.')
    elif method=='box_m':
        factor=data[:,0];values=data[:,1:];p=values.shape[1];categories,counts=np.unique(factor,return_counts=True);g=len(categories)
        if g<2 or min(counts)<=p:raise ValueError('Для M Бокса нужно минимум две группы с числом наблюдений больше числа показателей.')
        covariance=[np.atleast_2d(np.cov(values[factor==c],rowvar=False)) for c in categories]
        if any(np.linalg.slogdet(s)[0]<=0 for s in covariance):raise ValueError('Групповая ковариационная матрица вырождена.')
        pooled=sum((count-1)*s for count,s in zip(counts,covariance))/(n-g)
        m=(n-g)*np.linalg.slogdet(pooled)[1]-sum((count-1)*np.linalg.slogdet(s)[1] for count,s in zip(counts,covariance))
        correction=((2*p*p+3*p-1)/(6*(p+1)*(g-1)))*(np.sum(1/(counts-1))-1/(n-g));df=p*(p+1)*(g-1)/2
        if correction>=1:raise ValueError('Слишком мало наблюдений для χ²-приближения M Бокса.')
        chi=max(0,float((1-correction)*m))
        out.update(statistic=chi,statisticLabel='χ² Box M',p=float(stats.chi2.sf(chi,df)),df=df,formula='M=(N−g)ln|S_p|−Σ(nⱼ−1)ln|Sⱼ|; χ²=(1−c)M; df=p(p+1)(g−1)/2')
        out['steps'].append(f'M={m}; поправка c={correction}; многомерная нормальность и независимые группы.')
    elif method=='manova_repeated':
        from scipy.linalg import helmert
        contrasts=data@helmert(k).T;p=contrasts.shape[1];covariance=np.atleast_2d(np.cov(contrasts,rowvar=False))
        if n<=p or np.linalg.matrix_rank(covariance)!=p:raise ValueError('Недостаточно участников или вырождена ковариация контрастов.')
        mean=contrasts.mean(axis=0);t2=float(n*mean@np.linalg.solve(covariance,mean));f=(n-p)*t2/(p*(n-1))
        out.update(statistic=f,statisticLabel='F Hotelling',p=float(stats.f.sf(f,p,n-p)),df=[p,n-p],formula='T²=n·M_contrastᵀ S_contrast⁻¹ M_contrast; F=(n−p)T²/[p(n−1)]')
        out['steps'].append(f'Ортонормированные контрасты Хелмерта; T²={t2}. Требуется многомерная нормальность векторов контрастов; сферичность не нужна.')
    elif method in ['partial','compare_correlations','correlation_matrix']:
        if any(np.ptp(a)==0 for a in arrays):raise ValueError('Все показатели должны иметь вариативность.')
        if method=='partial':
            if k<3 or n<=k+1:raise ValueError('Для частной корреляции нужно N > числа показателей + 1 и минимум три показателя.')
            covariates=sm.add_constant(data[:,2:]);rank=np.linalg.matrix_rank(covariates)
            if rank!=covariates.shape[1]:raise ValueError('Контролируемые показатели линейно зависимы.')
            rx=sm.OLS(data[:,0],covariates).fit().resid;ry=sm.OLS(data[:,1],covariates).fit().resid
            if min(np.std(rx),np.std(ry))<1e-12:raise ValueError('После контроля не осталось вариативности.')
            r=float(stats.pearsonr(rx,ry).statistic);df=n-k
            t=r*np.sqrt(df/max(1-r*r,np.finfo(float).eps))
            out.update(statistic=r,statisticLabel='r_partial',p=float(2*stats.t.sf(abs(t),df)),df=df,formula='r_partial = cor(resid(X|C),resid(Y|C)); t=r√[df/(1−r²)]; df=n−c−2')
        elif method=='compare_correlations':
            if k!=3 or n<4:raise ValueError('Нужно три показателя и минимум четыре полных наблюдения.')
            r=np.corrcoef(data,rowvar=False);a,b,c=r[0,1],r[0,2],r[1,2];det=np.linalg.det(r)
            denominator=2*det*(n-1)/(n-3)+(a+b)**2/4*(1-c)**3
            if denominator<=0:raise ValueError('Вырожденная корреляционная матрица для критерия Уильямса.')
            t=(a-b)*np.sqrt((n-1)*(1+c)/denominator)
            out.update(statistic=float(t),statisticLabel='t Williams',p=float(2*stats.t.sf(abs(t),n-3)),df=n-3,formula='t=(rXY−rXZ)√[(n−1)(1+rYZ)/(2|R|(n−1)/(n−3)+((rXY+rXZ)²/4)(1−rYZ)³)]')
            out['steps'].append(f'rXY={a}; rXZ={b}; rYZ={c}; |R|={det}.')
        else:
            rows=[];pvalues=[]
            if n<4:raise ValueError('Для матрицы с ДИ нужно не менее четырёх полных наблюдений.')
            coefficient=int(params.get('coefficient',0))
            if coefficient not in range(3):raise ValueError('Неизвестный коэффициент связи.')
            for i in range(k):
                for j in range(i+1,k):
                    r=[stats.pearsonr,stats.spearmanr,stats.kendalltau][coefficient](data[:,i],data[:,j])
                    ci=r.confidence_interval(1-alpha) if coefficient==0 else None
                    rows.append([labels[i],labels[j],n,float(r.statistic),float(r.pvalue),float(ci.low) if ci else None,float(ci.high) if ci else None])
                    pvalues.append(float(r.pvalue))
            table(out,'Корреляции',['Показатель 1','Показатель 2','N','r','p','ДИ от','ДИ до','p · Холм'],[row+[float(p)] for row,p in zip(rows,multipletests(pvalues,method='holm')[1])])
            out['formula']=['Pearson; ДИ Fisher z','Spearman: Pearson средних рангов; p асимптотический','Kendall τ-b: совпадения учтены'][coefficient]+'; Holm по k(k−1)/2 уникальным парам'
            if coefficient:out['warnings'].append('ДИ ранговых связей здесь не рассчитываются; преобразование Fisher z Пирсона к ним не применяется.')
    elif method in ['repeated_factorial','mixed_anova']:
        from scipy.linalg import helmert
        def effect(name, projected, factor=None):
            dimension=projected.shape[1]
            if factor is None:
                ss=n*np.sum(projected.mean(axis=0)**2);error=np.sum((projected-projected.mean(axis=0))**2);df1=dimension;df2=(n-1)*dimension
                residual=projected-projected.mean(axis=0)
            else:
                categories=np.unique(factor);residual=np.zeros_like(projected);ss=0
                for category in categories:
                    block=projected[factor==category];ss+=len(block)*np.sum((block.mean(axis=0)-projected.mean(axis=0))**2)
                    residual[factor==category]=block-block.mean(axis=0)
                error=np.sum(residual**2);df1=(len(categories)-1)*dimension;df2=(n-len(categories))*dimension
            if error<=np.finfo(float).eps:raise ValueError('Нулевая дисперсия ошибки связанного эффекта.')
            covariance=np.atleast_2d(residual.T@residual);epsilon=float(np.clip(np.trace(covariance)**2/(dimension*np.trace(covariance@covariance)),1/dimension,1))
            f=(ss/df1)/(error/df2);p=stats.f.sf(f,df1*epsilon,df2*epsilon)
            return [name,ss,error,df1*epsilon,df2*epsilon,f,p,epsilon,ss/(ss+error)]
        rows=[]
        if method=='repeated_factorial':
            levels=int(params.get('levelsA',2))
            if levels<2 or k%levels or k//levels<2:raise ValueError('Число замеров должно быть A×B с минимум двумя уровнями каждого фактора.')
            a=levels;b=k//levels;cube=data.reshape(n,a,b)
            ca=helmert(a);cb=helmert(b)
            rows.append(effect('A',cube.mean(axis=2)@ca.T*np.sqrt(b)))
            rows.append(effect('B',cube.mean(axis=1)@cb.T*np.sqrt(a)))
            interaction=np.einsum('ia,nab,jb->nij',ca,cube,cb).reshape(n,-1)
            rows.append(effect('A×B',interaction))
            out['formula']='Полные ортонормированные контрасты A, B и A×B; F=(SS_effect/df_effect)/(SS_subject×effect/df_error); отдельная ε_GG'
        else:
            factor=data[:,0];values=data[:,1:];categories,counts=np.unique(factor,return_counts=True)
            if len(categories)<2 or min(counts)<3 or len(set(counts))!=1:raise ValueError('Для смешанного варианта нужны равные группы минимум по три участника.')
            projection=values@helmert(values.shape[1]).T
            mean=values.mean(axis=1)*np.sqrt(values.shape[1]);group_result=stats.f_oneway(*[mean[factor==c] for c in categories])
            rows.append(['Группа',None,None,len(categories)-1,n-len(categories),group_result.statistic,group_result.pvalue,1,None])
            # Balanced groups: orthogonal time and time×group hypotheses share within-group error.
            interaction=effect('Группа×замер',projection,factor)
            time=effect('Замер',projection)
            error=interaction[2];df1=projection.shape[1];df2=(n-len(categories))*df1;epsilon=interaction[7]
            f=(time[1]/df1)/(error/df2)
            rows.append(['Замер',time[1],error,df1*epsilon,df2*epsilon,f,stats.f.sf(f,df1*epsilon,df2*epsilon),epsilon,time[1]/(time[1]+error)])
            rows.append(interaction)
            out['formula']='Сбалансированный смешанный план: группа — между участниками; замер — внутри. F_time и F_interaction используют SS_subject(group)×time, df с ε_GG'
        table(out,'Связанные эффекты',['Эффект','SS','SS ошибки','df1 · GG','df2 · GG','F','p · GG','ε_GG','Частная η²'],rows)
    elif method.startswith('regression') or method=='multiple_correlation':
        y=data[:,0];predictors=data[:,1:]
        if method=='regression_quadratic':predictors=np.column_stack([predictors[:,0],predictors[:,0]**2])
        if method=='regression_cubic':predictors=np.column_stack([predictors[:,0],predictors[:,0]**2,predictors[:,0]**3])
        if method=='regression_logarithmic':
            if np.any(predictors<=0):raise ValueError('Для логарифмического предиктора нужен положительный X.')
            predictors=np.log(predictors)
        if method=='regression_inverse':
            if np.any(predictors==0):raise ValueError('Для обратного предиктора нужен X≠0.')
            predictors=1/predictors
        if method in ['regression_exponential','regression_power']:
            if np.any(y<=0):raise ValueError('Для логарифмической модели Y должен быть положительным.')
            y=np.log(y)
            if method=='regression_power':
                if np.any(predictors<=0):raise ValueError('Для степенной модели X должен быть положительным.')
                predictors=np.log(predictors)
        predictor_labels=labels[1:]
        if method in ['regression_quadratic','regression_cubic']:predictor_labels=[labels[1],'X²','X³'][:predictors.shape[1]]
        if method in ['regression_forward','regression_backward','regression_stepwise']:
            all_predictors=predictors
            def candidate(indices):return sm.OLS(y,np.column_stack([np.ones(n),all_predictors[:,indices]])).fit()
            selected=list(range(predictors.shape[1])) if method=='regression_backward' else []
            trajectory=[]
            for step in range(30):
                current=candidate(selected);candidates=[]
                if method!='regression_backward':
                    candidates += [(candidate(selected+[i]).aic,selected+[i]) for i in range(all_predictors.shape[1]) if i not in selected]
                if method!='regression_forward':
                    candidates += [(candidate([j for j in selected if j!=i]).aic,[j for j in selected if j!=i]) for i in selected]
                if not candidates:break
                score,indices=min(candidates,key=lambda item:item[0])
                if score>=current.aic-1e-8:break
                selected=indices;trajectory.append([step+1,', '.join(predictor_labels[i] for i in selected) or 'Только константа',score])
            predictors=all_predictors[:,selected];predictor_labels=[predictor_labels[i] for i in selected]
            table(out,'Траектория отбора',['Шаг','Предикторы','AIC'],trajectory)
            out['warnings'].append('Разведочный отбор по AIC. Стандартные p и ДИ после выбора модели не учитывают отбор; нужна независимая проверка.')
        design=np.column_stack([np.ones(n),predictors])
        if n<=design.shape[1] or np.linalg.matrix_rank(design)!=design.shape[1]:raise ValueError('Недостаточно наблюдений или предикторы линейно зависимы.')
        fit=sm.OLS(y,design).fit();ci=fit.conf_int(alpha)
        if fit.ssr<=np.finfo(float).eps*np.sum((y-y.mean())**2):raise ValueError('Практически нулевая остаточная дисперсия: статистический вывод регрессии не определён.')
        table(out,'Коэффициенты',['Параметр','B','SE','t','p','ДИ от','ДИ до'],
              [[('Константа' if i==0 else ('X²' if method=='regression_quadratic' and i==2 else predictor_labels[i-1])),b,se,t,p,lo,hi] for i,(b,se,t,p,(lo,hi)) in enumerate(zip(fit.params,fit.bse,fit.tvalues,fit.pvalues,ci))])
        out.update(statistic=float(fit.fvalue) if fit.df_model else None,statisticLabel='F',p=float(fit.f_pvalue) if fit.df_model else None,df=[float(fit.df_model),float(fit.df_resid)],effect=float(fit.rsquared),effectLabel='R²',formula='β=(XᵀX)⁻¹XᵀY; tⱼ=Bⱼ/SEⱼ; F=(SS_model/df_model)/(SS_error/df_error)')
        model_formulas={'regression_quadratic':'Y=b₀+b₁X+b₂X²+ε','regression_cubic':'Y=b₀+b₁X+b₂X²+b₃X³+ε','regression_exponential':'ln(Y)=b₀+b₁X+ε','regression_power':'ln(Y)=b₀+b₁ln(X)+ε','regression_logarithmic':'Y=b₀+b₁ln(X)+ε','regression_inverse':'Y=b₀+b₁/X+ε'}
        out['formula']=model_formulas.get(method,'Y=b₀+ΣbⱼXⱼ+ε')+'; '+out['formula']
        out['steps'].append('Интерсепт включён; OLS с полными случаями, ковариация коэффициентов s²(XᵀX)⁻¹; ДИ используют t(df_error).')
        table(out,'Диагностика',['Показатель','Значение'],[['N',n],['R²',fit.rsquared],['R² скорректированный',fit.rsquared_adj],['AIC',fit.aic],['BIC',fit.bic],['Число обусловленности',fit.condition_number],['RMSE',np.sqrt(fit.mse_resid)]])
        if method=='multiple_correlation':
            out.update(effect=float(np.sqrt(max(0,fit.rsquared))),effectLabel='Множественный R')
            out['steps'].append('R=√R²; основной F проверяет совместную нулевую связь со всеми предикторами.')
        table(out,'Остатки',['Наблюдение','Y модели','Прогноз','Остаток'],[[i+1,v,f,e] for i,(v,f,e) in enumerate(zip(y,fit.fittedvalues,fit.resid))])
        if fit.condition_number>1000:out['warnings'].append('Высокое число обусловленности: проверьте масштабы и мультиколлинеарность.')
        if method=='regression_hierarchical':
            rows=[];previous=None
            for size in range(1,predictors.shape[1]+1):
                current=sm.OLS(y,sm.add_constant(predictors[:,:size],has_constant='add')).fit()
                f,p,df=current.compare_f_test(previous) if previous is not None else (current.fvalue,current.f_pvalue,current.df_model)
                rows.append([size,current.rsquared,current.rsquared-(previous.rsquared if previous else 0),f,p,df]);previous=current
            table(out,'Последовательные блоки',['Предикторов','R²','ΔR²','F изменения','p изменения','Δdf'],rows)
            out['warnings'].append('Порядок предикторов задан до анализа. Последовательные p не включают поправку на выбор модели.')
        if method=='regression_compare':
            base=int(params.get('basePredictors',1))
            if not 1<=base<predictors.shape[1]:raise ValueError('В сокращённой модели нужен хотя бы один предиктор и меньше, чем в полной.')
            reduced=sm.OLS(y,np.column_stack([np.ones(n),predictors[:,:base]])).fit();f,p,df=fit.compare_f_test(reduced)
            table(out,'Вложенные модели',['Модель','Предикторов','N','R²','AIC','BIC'],[['Сокращённая',base,n,reduced.rsquared,reduced.aic,reduced.bic],['Полная',predictors.shape[1],n,fit.rsquared,fit.aic,fit.bic]])
            out.update(statistic=float(f),statisticLabel='F изменения',p=float(p),df=[float(df),float(fit.df_resid)],effect=float(fit.rsquared-reduced.rsquared),effectLabel='ΔR²')
            out['formula']='F=[(SSE_reduced−SSE_full)/(df_reduced−df_full)]/[SSE_full/df_full]; один набор строк и одна Y'
        if method in ['regression_exponential','regression_power']:out['warnings'].append('Зависимая переменная и остатки в логарифмической шкале; exp-прогноз — медиана, а не несмещённое среднее Y.')
    elif method=='factorial_anova':
        from statsmodels.formula.api import ols
        from statsmodels.stats.anova import anova_lm
        import pandas as pd
        if not 3<=k<=5:raise ValueError('Нужны Y и от двух до четырёх факторов.')
        names=['f'+str(i) for i in range(1,k)];frame=pd.DataFrame({'y':data[:,0],**{name:data[:,i+1].astype(str) for i,name in enumerate(names)}})
        levels=[frame[name].nunique() for name in names];cells=frame.groupby(names).size()
        if min(levels)<2 or np.prod(levels)>64 or len(cells)!=np.prod(levels) or cells.min()<2:
            raise ValueError('Нужны минимум два уровня каждого фактора и по два наблюдения в каждой ячейке полного плана, до 64 ячеек.')
        fit=ols('y ~ '+'*'.join('C('+name+')' for name in names),frame).fit();result=anova_lm(fit,typ=2);rows=[]
        for name,row in result.iterrows():
            rows.append([str(name),row['sum_sq'],row['df'],None if name=='Residual' else row['F'],None if name=='Residual' else row['PR(>F)']])
        table(out,'ANOVA · тип II',['Источник','SS','df','F','p'],rows)
        table(out,'Обозначения факторов',['Обозначение','Показатель'],[[name,labels[i+1]] for i,name in enumerate(names)])
        out['formula']='Полный фиксированный факторный план со всеми взаимодействиями; F=MS_effect/MS_error; SS типа II'
        out['warnings'].append('Фиксированные эффекты; независимость и однородность дисперсий. При взаимодействии основные эффекты требуют осторожной интерпретации.')
    elif method=='manova':
        from statsmodels.multivariate.manova import MANOVA
        categories=np.unique(data[:,0])
        if len(categories)<2 or len(categories)>20:raise ValueError('Нужно от 2 до 20 классов.')
        dummy=np.column_stack([data[:,0]==v for v in categories[1:]]).astype(float)
        design=sm.add_constant(dummy,has_constant='add');endog=data[:,1:]
        if n-design.shape[1]<endog.shape[1] or np.linalg.matrix_rank(np.cov(endog,rowvar=False))<endog.shape[1]:raise ValueError('Недостаточная остаточная размерность или зависимые показатели MANOVA.')
        contrast=np.eye(design.shape[1])[1:]
        result=MANOVA(endog,design).mv_test([('Групповой фактор',contrast)])
        frame=result.results['Групповой фактор']['stat']
        table(out,'MANOVA',['Критерий','Значение','df1','df2','F','p'],[[str(name)]+list(row.values) for name,row in frame.iterrows()])
        out['formula']='E=остаточная SSCP; H=эффект SSCP; собственные значения (E+H)⁻¹H → Pillai / Wilks / Hotelling / Roy'
    elif method in ['pca','efa_pa','efa_ml','efa_uls','efa_gls']:
        for a in arrays:nonconstant(a)
        if n<=k:raise ValueError('Для факторного разложения нужно больше участников, чем показателей.')
        z=StandardScaler().fit_transform(data);correlation=np.corrcoef(z,rowvar=False)
        if method!='pca' and np.linalg.matrix_rank(correlation)<k:raise ValueError('Корреляционная матрица вырождена: уберите зависимые показатели.')
        components=int(params.get('components',2 if method=='pca' else 1))
        selection=int(params.get('selection',0))
        if selection:
            observed=np.linalg.eigvalsh(correlation)[::-1]
            if selection==1:
                components=int(np.sum(observed>1))
                out['steps'].append('Число осей по правилу Кайзера: собственное значение корреляционной матрицы > 1.')
            elif selection==2:
                rng=np.random.default_rng(20261020);reference=[]
                for _ in range(200):reference.append(np.linalg.eigvalsh(np.corrcoef(rng.normal(size=(n,k)),rowvar=False))[::-1])
                threshold=np.quantile(reference,.95,axis=0)
                # Retain a contiguous leading sequence, never a later isolated component.
                components=0
                for value,limit in zip(observed,threshold):
                    if value<=limit:break
                    components+=1
                table(out,'Параллельный анализ',['Ось','Наблюдаемое λ','Порог 95%'],[[i+1,v,t] for i,(v,t) in enumerate(zip(observed,threshold))])
                out['steps'].append('200 независимых нормальных матриц N×p, 95-й процентиль каждого собственного значения; seed=20261020.')
            else:raise ValueError('Неизвестный способ выбора размерности.')
            if components==0:raise ValueError('Автоматический критерий не выделил ни одной оси. Это результат проверки структуры; при обоснованном плане задайте размерность вручную.')
            out['steps'].append(f'Автоматически выбрано осей: {components}.')
        if not 1<=components<=(k if method=='pca' else k-1):raise ValueError('Компонент не должно быть больше показателей; факторов должно быть меньше показателей.')
        if method=='pca':
            basis=np.cov(data,rowvar=False) if params.get('basis',0)==1 else correlation
            eigen,vectors=np.linalg.eigh(basis);order=np.argsort(eigen)[::-1];eigen=eigen[order];vectors=vectors[:,order]
            if eigen[components-1]<=1e-12:raise ValueError('Для выбранного числа компонент недостаточно положительных собственных значений.')
            loadings=vectors[:,:components]*np.sqrt(eigen[:components]);centered=data-data.mean(axis=0)
            scores=(centered if params.get('basis',0)==1 else centered/data.std(axis=0,ddof=1))@vectors[:,:components]
            table(out,'Спектр',['Компонента','Собственное значение','Доля','Накопленная доля'],[[i+1,v,v/eigen.sum(),np.sum(eigen[:i+1])/eigen.sum()] for i,v in enumerate(eigen)])
            out['formula']='S=VΛVᵀ; нагрузки=V√Λ; оценки=XV; '+('ковариационная матрица, центрированные исходные единицы' if params.get('basis',0)==1 else 'корреляционная матрица, выборочная стандартизация')
        else:
            from statsmodels.multivariate.factor import Factor
            from statsmodels.multivariate.factor_rotation import rotate_factors
            result=None
            if method in ['efa_pa','efa_ml']:
                result=Factor(corr=correlation,n_factor=components,method='pa' if method=='efa_pa' else 'ml',nobs=n).fit(maxiter=500, rng=20261020)
                loadings=result.loadings
                if method=='efa_ml' and getattr(result,'mle_retvals',None) and not result.mle_retvals.get('success',True):raise ValueError('ML-извлечение не сошлось. Измените число факторов или данные.')
            else:
                from scipy.optimize import minimize
                eigen,vectors=np.linalg.eigh(correlation);initial=vectors[:,-components:]*np.sqrt(np.maximum(eigen[-components:]-.4,.01))
                initial_uniqueness=np.maximum(1-np.sum(initial**2,axis=1),.05)
                weight=np.linalg.inv(correlation) if method=='efa_gls' else np.eye(k)
                def objective(values):
                    loading=values[:k*components].reshape(k,components);unique=values[k*components:]
                    residual=loading@loading.T+np.diag(unique)-correlation;weighted=weight@residual@weight
                    loss=np.trace(residual@weight@residual@weight)
                    gradient=np.r_[(4*weighted@loading).ravel(),2*np.diag(weighted)]
                    return float(loss),gradient
                fit=minimize(objective,np.r_[initial.ravel(),initial_uniqueness],jac=True,method='L-BFGS-B',bounds=[(None,None)]*(k*components)+[(1e-6,2)]*k,options={'maxiter':1500,'ftol':1e-12,'gtol':1e-7})
                if not fit.success:raise ValueError('Факторное извлечение наименьшими квадратами не сошлось.')
                loadings=fit.x[:k*components].reshape(k,components);unique=fit.x[k*components:]
                scale=np.sqrt(np.sum(loadings**2,axis=1)+unique);loadings=loadings/scale[:,None]
                table(out,'Оптимизация извлечения',['Показатель','Значение'],[['Критерий',fit.fun],['Итераций',fit.nit]])
                out['steps'].append('Минимизация tr[(Σ−R)W(Σ−R)W], Σ=LLᵀ+Ψ; W='+('R⁻¹' if method=='efa_gls' else 'I')+'; Ψ≥10⁻⁶. Нагрузки нормированы на диагональ оценённой Σ.')
            rotation_id=int(params.get('rotation',1))
            rotation_names=['none','varimax','quartimax','equamax','quartimin','promax']
            if rotation_id not in range(6):raise ValueError('Неизвестное вращение факторов.')
            phi=np.eye(components)
            if components>1 and rotation_id:
                if rotation_id==5:
                    from statsmodels.multivariate.factor_rotation import promax
                    loadings,rotation=promax(loadings)
                else:loadings,rotation=rotate_factors(loadings,rotation_names[rotation_id])
                phi=rotation.T@rotation
            scores=z@np.linalg.solve(correlation,loadings)@phi
            communalities=np.diag(loadings@phi@loadings.T)
            if np.any(communalities>1.000001):raise ValueError('Недопустимое факторное решение: общность выше единицы. Уменьшите число факторов.')
            table(out,'Общности',['Показатель','Общность','Уникальность'],[[label,c,1-c] for label,c in zip(labels,communalities)])
            inverse=np.linalg.inv(correlation);partial=-inverse/np.sqrt(np.outer(np.diag(inverse),np.diag(inverse)));np.fill_diagonal(partial,0);r=correlation-np.eye(k)
            kmo=np.sum(r*r)/(np.sum(r*r)+np.sum(partial*partial));chi=-(n-1-(2*k+5)/6)*np.linalg.slogdet(correlation)[1];df=k*(k-1)/2
            table(out,'Пригодность матрицы',['Показатель','Значение','p'],[['KMO',kmo,None],['Бартлетт χ²',chi,float(stats.chi2.sf(chi,df))]])
            out['formula']='R=LΦLᵀ+Ψ; извлечение '+method+'; вращение '+rotation_names[rotation_id]+'; регрессионные оценки ZR⁻¹LΦ'
            out['steps'].append('При одном факторе вращение не применяется.')
            table(out,'Корреляции факторов',['Фактор']+[str(i+1) for i in range(components)],[[i+1]+list(row) for i,row in enumerate(phi)])
        table(out,'Нагрузки',['Показатель']+[str(i+1) for i in range(components)],[[label]+list(row) for label,row in zip(labels,loadings)])
        table(out,'Оценки',['Наблюдение']+[str(i+1) for i in range(components)],[[i+1]+list(row) for i,row in enumerate(scores)])
        out['warnings'].append('Знаки и порядок факторов/компонент условны. Содержание требует интерпретации исследователя.')
    elif method in ['discriminant','discriminant_stepwise']:
        from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
        from sklearn.model_selection import LeaveOneOut, cross_val_predict
        target=data[:,0];features=data[:,1:];categories,counts=np.unique(target,return_counts=True)
        if len(categories)<2 or min(counts)<3 or n>500:raise ValueError('Нужно минимум два класса по три наблюдения; leave-one-out ограничен 500 участниками.')
        if n-len(categories)<=features.shape[1] or np.linalg.matrix_rank(features-features.mean(axis=0))<features.shape[1]:raise ValueError('Недостаточная размерность или зависимые признаки.')
        if method=='discriminant_stepwise':
            from sklearn.feature_selection import SequentialFeatureSelector
            from sklearn.pipeline import make_pipeline
            from sklearn.model_selection import StratifiedKFold
            if n>200 or min(counts)<6:raise ValueError('Для вложенного отбора нужно до 200 участников и минимум шесть на класс.')
            selector=SequentialFeatureSelector(LinearDiscriminantAnalysis(),n_features_to_select='auto',tol=.001,direction='forward',scoring='balanced_accuracy',cv=StratifiedKFold(2,shuffle=True,random_state=20261020))
            pipeline=make_pipeline(selector,LinearDiscriminantAnalysis())
            validated=cross_val_predict(pipeline,features,target,cv=StratifiedKFold(3,shuffle=True,random_state=20261020))
            pipeline.fit(features,target);selected=pipeline[0].get_support();predicted=pipeline.predict(features)
            fit=pipeline[1];scores=fit.transform(features[:,selected])
            table(out,'Выбранные признаки',['Показатель','Включён'],[[label,'Да' if selected[i] else 'Нет'] for i,label in enumerate(labels[1:])])
            validation_label='Точность внешней 3-fold проверки'
            out['steps'].append('Отбор включён внутрь каждого внешнего fold; внутренние 2 fold, balanced accuracy, минимальный прирост 0,001; seed=20261020.')
        else:
            fit=LinearDiscriminantAnalysis(solver='svd').fit(features,target);predicted=fit.predict(features);validated=cross_val_predict(LinearDiscriminantAnalysis(),features,target,cv=LeaveOneOut())
            scores=fit.transform(features);validation_label='Точность leave-one-out'
        table(out,'Классификация',['Наблюдение','Класс','Прогноз · обучение','Прогноз · проверка'],[[i+1,a,b,c] for i,(a,b,c) in enumerate(zip(target,predicted,validated))])
        table(out,'Качество',['Показатель','Значение'],[['Точность на обучении',np.mean(predicted==target)],[validation_label,np.mean(validated==target)]])
        table(out,'Канонические координаты',['Наблюдение']+[str(i+1) for i in range(scores.shape[1])],[[i+1]+list(row) for i,row in enumerate(scores)])
        out['formula']='LDA: общая внутригрупповая ковариация; априорные вероятности — доли классов; '+validation_label+' с переобучением'
    elif method in ['cluster','mds_classical','mds_nonmetric']:
        for a in arrays:nonconstant(a)
        z=StandardScaler().fit_transform(data) if params.get('standardize',1) else data
        variable_objects=method=='cluster' and params.get('objects',0)==1
        if variable_objects:z=z.T
        n=len(z)
        if n>500:raise ValueError('Методы попарных расстояний ограничены 500 объектами за запуск.')
        metric_names=['euclidean','sqeuclidean','cityblock','chebyshev','cosine','correlation','hamming','jaccard','chisquare']
        metric_id=int(params.get('metric',0))
        if metric_id not in range(len(metric_names)):raise ValueError('Неизвестная метрика.')
        metric=metric_names[metric_id]
        if metric_id in [6,7]:
            if not set(data.ravel()).issubset({0.,1.}) or params.get('standardize',1):raise ValueError('Для бинарной метрики нужны 0/1 и исходные значения без стандартизации.')
        if metric_id==8:
            if params.get('standardize',1) or np.any(z<0) or np.any(z.sum(axis=1)==0):raise ValueError('Для χ² нужны неотрицательные частоты без стандартизации, с положительными суммами строк.')
            mass=z.sum(axis=0)/z.sum();valid=mass>0;profiles=z[:,valid]/z.sum(axis=1,keepdims=True)
            distances=pdist(profiles/np.sqrt(mass[valid]),metric='euclidean')
        else:distances=pdist(z,metric=metric)
        matrix=squareform(distances)
        if not np.isfinite(distances).all():raise ValueError('Расстояния не определены: проверьте нулевые и постоянные профили.')
        if method=='cluster':
            clusters=int(params.get('clusters',2))
            if not 2<=clusters<n:raise ValueError('Число кластеров должно быть от двух до N−1.')
            linkage_names=['ward','single','complete','average','weighted','centroid','median'];linkage_id=int(params.get('linkage',0))
            if linkage_id not in range(len(linkage_names)):raise ValueError('Неизвестный способ объединения.')
            link=linkage_names[linkage_id]
            if link in ['ward','centroid','median'] and metric!='euclidean':raise ValueError('Для Уорда, центроида и медианной связи нужно евклидово расстояние.')
            tree=linkage(distances,method=link);membership=fcluster(tree,t=clusters,criterion='maxclust')
            table(out,'Кластеры',['Показатель' if variable_objects else 'Наблюдение','Кластер'],[[labels[i] if variable_objects else i+1,int(c)] for i,c in enumerate(membership)])
            table(out,'Агломерация',['Новый узел','Узел 1','Узел 2','Расстояние','Размер'],[[n+i+1,int(a)+1,int(b)+1,d,int(count)] for i,(a,b,d,count) in enumerate(tree)])
            out['formula']='Агломерация '+link+'; метрика '+metric+'; разрез дерева maxclust'
        else:
            dimensions=int(params.get('components',2))
            if not 1<=dimensions<min(n,4):raise ValueError('Размерность должна быть 1–3 и меньше числа участников.')
            if method=='mds_classical':
                h=np.eye(n)-np.ones((n,n))/n;b=-.5*h@(matrix**2)@h;eigen,vectors=np.linalg.eigh(b);order=np.argsort(eigen)[::-1];eigen=eigen[order];vectors=vectors[:,order]
                if eigen[dimensions-1]<=1e-12:raise ValueError('Для размерности недостаточно положительных собственных значений.')
                coordinates=vectors[:,:dimensions]*np.sqrt(eigen[:dimensions])
                table(out,'Собственные значения',['Ось','Значение'],[[i+1,v] for i,v in enumerate(eigen)])
                out['formula']='B=−½HD²H; H=I−11ᵀ/n; X=V₊√Λ₊'
            else:
                from sklearn.manifold import MDS
                if np.any(distances==0):raise ValueError('Есть одинаковые профили: нулевые различия в неметрическом MDS считаются пропусками. Уберите дублирующиеся профили из выборки.')
                fit=MDS(n_components=dimensions,metric_mds=False,init='random',metric='precomputed',n_init=4,max_iter=1000,eps=1e-6,random_state=20261020,normalized_stress=True)
                coordinates=fit.fit_transform(matrix)
                table(out,'Сходимость',['Показатель','Значение'],[['Stress-1',fit.stress_],['Итераций',fit.n_iter_],['Seed',20261020]])
                if fit.n_iter_>=1000:raise ValueError('Неметрическое шкалирование достигло лимита итераций без подтверждённой сходимости.')
                out['formula']='Stress-1=√[Σ(dᵢⱼ−d̂ᵢⱼ)²/Σdᵢⱼ²]; монотонное преобразование различий, SMACOF'
            table(out,'Координаты',['Наблюдение']+[str(i+1) for i in range(dimensions)],[[i+1]+list(row) for i,row in enumerate(coordinates)])
        out['steps'].append(('Объекты — показатели; профили по участникам; ' if variable_objects else 'Объекты — участники; ')+'метрика '+metric+'. '+('Z-стандартизация исходных показателей, ddof=0.' if params.get('standardize',1) else 'Исходные значения без стандартизации.'))
    else:
        raise ValueError('Метод пока не поддерживается.')
