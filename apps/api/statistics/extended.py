"""Additional procedures. Columns are aligned by immutable response session ID."""
import math
import numpy as np
from scipy import stats
from statsmodels.stats.multitest import multipletests
from scipy.linalg import helmert
from diagnostics import sphericity


def table(out, title, columns, rows):
    out.setdefault('tables', []).append(dict(title=title, columns=columns, rows=rows))


def test(out, result, label, formula):
    out.update(statistic=float(result.statistic), p=float(result.pvalue), statisticLabel=label, formula=formula)


def binary(x):
    if not set(x).issubset({0., 1.}):
        raise ValueError('Для этого метода нужны исходы с кодами 0 и 1.')
    return int(x.sum())


def nonconstant(x):
    if np.ptp(x) == 0:
        raise ValueError('Нужен показатель с ненулевой вариативностью.')


def aligned(arrays, minimum=2):
    if len(arrays) < minimum or len(set(map(len, arrays))) != 1:
        raise ValueError('Выберите полный набор связанных показателей одних участников.')
    return np.column_stack(arrays)


def calculate_extended(request, arrays, out):
    import statsmodels
    out['packages'] = {'statsmodels': statsmodels.__version__}
    method = request['method']; alpha = request.get('alpha', .05)
    params = request.get('parameters', {})
    vectors = request.get('vectors', {})
    x = arrays[0]; y = arrays[1] if len(arrays) > 1 else None
    labels = [g['label'] for g in request['groups']]
    out['steps'] = ['Использованы пригодные наблюдения из зафиксированного снимка. Пропуски не заменяются нулями.']
    if method == 'contrast':
        weights=np.asarray(vectors.get('weights',[]),dtype=float);k=len(arrays);n=sum(map(len,arrays));df=n-k
        if len(weights)!=k or not np.isfinite(weights).all() or not np.isclose(weights.sum(),0,atol=1e-10,rtol=0) or not np.any(weights):raise ValueError('Нужен один вес на группу; веса конечные, сумма нулевая, не все нули.')
        mse=sum(np.sum((a-a.mean())**2) for a in arrays)/df
        if mse<=0:raise ValueError('Нулевая внутригрупповая дисперсия.')
        estimate=sum(w*a.mean() for w,a in zip(weights,arrays));se=np.sqrt(mse*sum(w*w/len(a) for w,a in zip(weights,arrays)));t=estimate/se;margin=stats.t.ppf(1-alpha/2,df)*se
        out.update(statistic=float(t),statisticLabel='t contrast',p=float(2*stats.t.sf(abs(t),df)),df=df,effect=float(estimate),effectLabel='Контраст средних',ci=[estimate-margin,estimate+margin],ciLabel='ДИ контраста',formula='L=ΣcⱼMⱼ; SE=√[MSE·Σcⱼ²/nⱼ]; t=L/SE; Σcⱼ=0')
        table(out,'Веса контраста',['Группа','Вес'],[[label,w] for label,w in zip(labels,weights)])
    elif method == 'runs_two':
        combined=np.r_[x,y]
        if len(combined)>200 or len(np.unique(combined))!=len(combined):raise ValueError('Для двухвыборочных серий нужно до 200 наблюдений без совпадений.')
        def count(a,b):
            order=np.argsort(np.r_[a,b]);marks=np.r_[np.zeros(len(a)),np.ones(len(b))][order]
            return float(1+np.sum(marks[1:]!=marks[:-1]))
        r=stats.permutation_test((x,y),count,permutation_type='independent',alternative='two-sided',n_resamples=9999,rng=np.random.default_rng(20261020))
        test(out,r,'R','R=1+Σ I(group₍ᵢ₎≠group₍ᵢ₋₁₎) в объединённом сортированном ряду')
        out['steps'].append('Перестановочный двусторонний p, до 9999 перестановок, seed=20261020.')
    elif method in ['linkwallace','nemenyi_independent']:
        if len(arrays)<3 or len(set(map(len,arrays)))!=1:raise ValueError('Нужно минимум три независимые группы равного размера.')
        n=len(x);k=len(arrays);combined=np.concatenate(arrays)
        if method=='linkwallace':
            if len(combined)>200:raise ValueError('Перестановочный Линка—Уоллеса ограничен 200 наблюдениями.')
            def score(*groups):
                spread=sum(np.ptp(a) for a in groups);difference=np.ptp([a.mean() for a in groups])
                return float(n*difference/spread) if spread else (float('inf') if difference else 0.)
            if not np.isfinite(score(*arrays)):raise ValueError('Все внутригрупповые размахи равны нулю.')
            r=stats.permutation_test(tuple(arrays),score,permutation_type='independent',alternative='greater',n_resamples=9999,rng=np.random.default_rng(20261020))
            test(out,r,'K','K=n·(max(Mⱼ)−min(Mⱼ))/Σⱼ(max(Xⱼ)−min(Xⱼ))')
            out['alternative']='heterogeneity'
            out['steps'].append('Ермолаев, §10.2.1, формула 10.12: в печатном числителе опечатка max−max; разобранный пример использует max−min. Перестановочный p (9999, seed=20261020), не интерполяция книжной таблицы.')
        else:
            ranks=stats.rankdata(combined).reshape(k,n);means=ranks.mean(axis=1);N=len(combined)
            _,ties=np.unique(combined,return_counts=True);correction=1-np.sum(ties**3-ties)/(N**3-N)
            if correction<=0:raise ValueError('Все значения одинаковые: ранговое сравнение не определено.')
            scale=np.sqrt(N*(N+1)/(12*n)*correction);rows=[]
            for i in range(k):
                for j in range(i+1,k):
                    q=abs(means[i]-means[j])/scale
                    rows.append([labels[i],labels[j],float(n*abs(means[i]-means[j])),float(q),float(stats.studentized_range.sf(q,k,np.inf))])
            table(out,'Немени · независимые группы',['Группа 1','Группа 2','Разность сумм рангов','q','p · Немени'],rows)
            out['formula']='q=|R̄ᵢ−R̄ⱼ|/√[N(N+1)C_ties/(12n)]; p — studentized range(k,∞)'
            out['steps'].append('Ермолаев §10.2.2: независимый вариант с равными n; современное асимптотическое p, поправка на совпадения.')
    elif method == 'compare_independent_correlations':
        if len(arrays)!=4 or len(arrays[0])!=len(arrays[1]) or len(arrays[2])!=len(arrays[3]) or min(map(len,arrays))<=3:
            raise ValueError('Нужно по четыре и более полных пары в двух независимых выборках.')
        for a in arrays:nonconstant(a)
        r1=stats.pearsonr(arrays[0],arrays[1]).statistic;r2=stats.pearsonr(arrays[2],arrays[3]).statistic
        if abs(r1)>=1 or abs(r2)>=1:raise ValueError('Fisher z не определён при корреляции ±1.')
        se=np.sqrt(1/(len(arrays[0])-3)+1/(len(arrays[2])-3));z=(np.arctanh(r1)-np.arctanh(r2))/se
        out.update(statistic=float(z),statisticLabel='z',p=float(2*stats.norm.sf(abs(z))),effect=float(r1-r2),effectLabel='r₁ − r₂',formula='z=[atanh(r₁)−atanh(r₂)]/√[1/(n₁−3)+1/(n₂−3)]')
        table(out,'Исходные корреляции',['Выборка','N','r'],[['Первая',len(arrays[0]),r1],['Вторая',len(arrays[2]),r2]])
    elif method == 'normal_scores':
        ranks=stats.rankdata(x);scores=stats.norm.ppf((ranks-.375)/(len(x)+.25))
        table(out,'Нормализованные оценки',['Наблюдение','Значение','Ранг','Нормализованная оценка'],[[i+1,v,r,z] for i,(v,r,z) in enumerate(zip(x,ranks,scores))])
        out['formula']='zᵢ=Φ⁻¹[(Rᵢ−3/8)/(n+1/4)]; средние ранги при совпадениях'
    elif method in ['sample_size_mean','sample_size_proportion']:
        precision=params.get('precision',1 if method=='sample_size_mean' else .05);population=int(params.get('population',0))
        if precision<=0 or population<0:raise ValueError('Ошибка должна быть положительной, размер совокупности неотрицательным.')
        if method=='sample_size_mean':
            nonconstant(x);variance=x.var(ddof=1)
        else:
            proportion=binary(x)/len(x);variance=proportion*(1-proportion)
            if variance==0:raise ValueError('Предварительная доля равна 0 или 1. Для планирования задайте консервативную базу с обоими исходами.')
        n0=stats.norm.ppf(1-alpha/2)**2*variance/precision**2
        target=n0/(1+(n0-1)/population) if population else n0
        out.update(statistic=max(2,int(np.ceil(target))),statisticLabel='Планируемый N',formula='n₀=z²·σ²/Δ²; для доли σ²=p(1−p); n=n₀/[1+(n₀−1)/N_population]')
        out['steps'].append(f'Предварительная дисперсия/ p(1−p)={variance}; Δ={precision}; n₀={n0}; совокупность={population or "неизвестна"}.')
        out['warnings'].append('Приближённое планирование при случайном независимом отборе. Не подтверждает репрезентативность и не является расчётом мощности теста.')
    elif method == 'kendall_a':
        aligned(arrays);nonconstant(x);nonconstant(y)
        if len(x)>200:raise ValueError('Перестановочный τ-a ограничен 200 наблюдениями.')
        upper=np.triu_indices(len(x),1)
        def coefficient(a,b):return float(np.mean(np.sign((a[:,None]-a[None,:])[upper])*np.sign((b[:,None]-b[None,:])[upper])))
        r=stats.permutation_test((x,y),coefficient,permutation_type='pairings',alternative='two-sided',n_resamples=9999,rng=np.random.default_rng(20261020))
        test(out,r,'τ-a','τ_a=(P−Q)/[n(n−1)/2]')
        out['steps'].append('Перестановки парных связей, до 9999, seed=20261020. Совпадения учитываются в знаменателе.')
    elif method == 'rosenbaum':
        if min(len(x),len(y))<11 or sum(map(len,arrays))>300:raise ValueError('Для этого варианта Q нужно 11–300 наблюдений в группах, всего не более 300.')
        def score(a,b):return float(np.sum(a>b.max())+np.sum(b<a.min()))
        r=stats.permutation_test((x,y),score,permutation_type='independent',alternative='greater',n_resamples=9999,rng=np.random.default_rng(20261020))
        test(out,r,'Q','Q = #{x>max(y)} + #{y<min(x)}')
        out['alternative']='first-greater'
        out['steps'].append('Заранее заданное направление: первая группа выше второй; равенства не считаются крайними. Перестановочный p, seed=20261020, 9999; не книжная критическая таблица.')
    elif method in ['frequency', 'ranks', 'standardize']:
        if method == 'frequency':
            values, counts = np.unique(x, return_counts=True)
            bins=int(params.get('bins',0))
            if bins:
                if not 1<=bins<=50:raise ValueError('Число интервалов должно быть от 1 до 50.')
                counts,edges=np.histogram(x,bins=bins)
                values=[f'[{edges[i]}; {edges[i+1]}'+(']' if i==bins-1 else ')') for i in range(bins)]
                out['steps'].append('Равные интервалы: левая граница включена, правая исключена; последняя правая граница включена. Пустые интервалы сохранены.')
            cumulative = np.cumsum(counts)
            table(out, 'Частоты', ['Значение','Частота','Доля','Накопленная частота','Накопленная доля'],
                  [[v,int(c),c/len(x),int(s),s/len(x)] for v,c,s in zip(values,counts,cumulative)])
            out['formula']='pᵢ = nᵢ/n; Fᵢ = Σⱼ≤ᵢ nⱼ/n'
        elif method == 'ranks':
            ranks=stats.rankdata(x)
            table(out,'Ранги',['Наблюдение','Значение','Ранг'],[[i+1,v,r] for i,(v,r) in enumerate(zip(x,ranks))])
            out['formula']='R(x) = среднее мест одинаковых значений в возрастающем ряду'
            out['steps'].append(f'Сумма рангов = {ranks.sum()}; контроль n(n+1)/2 = {len(x)*(len(x)+1)/2}.')
        else:
            nonconstant(x); target=params.get('targetMean',50); sd=params.get('targetSd',10)
            if sd<=0: raise ValueError('Стандартное отклонение новой шкалы должно быть положительным.')
            reference_mean=params.get('referenceMean',0) if params.get('basis',0) else x.mean()
            reference_sd=params.get('referenceSd',1) if params.get('basis',0) else x.std(ddof=1)
            if reference_sd<=0:raise ValueError('SD базы должно быть положительным.')
            z=(x-reference_mean)/reference_sd
            table(out,'Стандартные оценки',['Наблюдение','Значение','Z','Новая шкала','Процентиль ранга'],
                  [[i+1,v,a,target+sd*a,100*(r-.5)/len(x)] for i,(v,a,r) in enumerate(zip(x,z,stats.rankdata(x)))])
            out['formula']='zᵢ = (xᵢ − M)/s; Tᵢ = M_target + s_target·zᵢ'
            out['steps'].append(f'База: {"внешние заданные параметры" if params.get("basis",0) else "выбранная выборка"}; M={reference_mean}, s={reference_sd}; целевые M={target}, s={sd}. Внешние параметры вводятся исследователем и не подменяют нормы методики.')
    elif method == 'ks_normal':
        sd=params.get('referenceSd',1); mu=params.get('referenceMean',0)
        if sd<=0: raise ValueError('Заданное σ должно быть положительным.')
        distribution=int(params.get('distribution',0))
        if distribution not in range(3):raise ValueError('Неизвестное распределение.')
        name=['norm','uniform','expon'][distribution]
        test(out,stats.kstest(x,name,args=(mu,sd),method='exact'),'D','D = sup |Fₙ(x) − F₀(x; loc, scale)|')
        out['steps'].append('Теоретическое семейство: '+name+'.')
        out['steps'].append(f'Независимо заданные параметры: μ={mu}; σ={sd}; exact p для непрерывной H₀.')
        out['warnings'].append('Если параметры оценены по этим же данным, выберите Лиллиефорса вместо этого критерия.')
    elif method == 'lilliefors':
        from statsmodels.stats.diagnostic import lilliefors
        nonconstant(x)
        if len(x)<4: raise ValueError('Для Лиллиефорса нужно не менее четырёх наблюдений.')
        statistic,p=lilliefors(x,dist='norm',pvalmethod='table')
        out.update(statistic=float(statistic),p=float(p),statisticLabel='D',formula='D = sup |Fₙ(x) − Φ((x−M)/s)|; p — калибровка Лиллиефорса')
        out['steps'].append('statsmodels.lilliefors: табличная калибровка; p ограничен табличным диапазоном [0,001; 0,99].')
    elif method == 'ks_two':
        test(out,stats.ks_2samp(x,y,method='exact'),'D','D = sup |F₁(x) − F₂(x)|')
        out['steps'].append(f'λ = D·√(n₁n₂/(n₁+n₂)) = {out["statistic"]*math.sqrt(len(x)*len(y)/(len(x)+len(y)))}')
        if len(np.unique(np.r_[x,y]))<len(x)+len(y):
            out['warnings'].append('Есть совпадения: стандартный p рассчитан для непрерывных распределений и может быть консервативным.')
    elif method == 'variance_f':
        nonconstant(x);nonconstant(y); f=x.var(ddof=1)/y.var(ddof=1); df1=len(x)-1;df2=len(y)-1
        out.update(statistic=float(f),statisticLabel='F',p=float(min(1,2*min(stats.f.cdf(f,df1,df2),stats.f.sf(f,df1,df2)))),df=[df1,df2],formula='F = s₁²/s₂²; p = 2·min(P(F≤f), P(F≥f))')
        out['warnings'].append('F-критерий дисперсий чувствителен к отклонениям от нормальности.')
    elif method in ['levene','brown_forsythe']:
        center='mean' if method=='levene' else 'median'
        test(out,stats.levene(*arrays,center=center),'W','Zᵢⱼ = |Xᵢⱼ − centerⱼ|; W = ANOVA(Z)')
        out['df']=[len(arrays)-1,sum(map(len,arrays))-len(arrays)]
        out['steps'].append('Центрирование: '+center+'.')
    elif method == 't_independent':
        se=math.sqrt(((len(x)-1)*x.var(ddof=1)+(len(y)-1)*y.var(ddof=1))/(len(x)+len(y)-2)*(1/len(x)+1/len(y)))
        if se==0: raise ValueError('Нулевая объединённая дисперсия.')
        test(out,stats.ttest_ind(x,y,equal_var=True),'t','sₚ² = [(n₁−1)s₁²+(n₂−1)s₂²]/(n₁+n₂−2); t=(M₁−M₂)/(sₚ√(1/n₁+1/n₂))')
        difference=float(x.mean()-y.mean());df=len(x)+len(y)-2;margin=stats.t.ppf(1-alpha/2,df)*se
        out.update(df=df,effect=difference,effectLabel='Разность средних: первая − вторая',ci=[difference-margin,difference+margin],ciLabel='ДИ разности средних')
    elif method in ['friedman','page','repeated_anova','nemenyi']:
        data=aligned(arrays,3);n,k=data.shape
        if method == 'friedman':
            if np.all(np.ptp(data,axis=1)==0):raise ValueError('Во всех блоках одинаковые значения.')
            test(out,stats.friedmanchisquare(*arrays),'χ²','χ²_F = [12/(nk(k+1))·ΣRⱼ² − 3n(k+1)] / C_ties')
            out.update(df=k-1,effect=out['statistic']/(n*(k-1)),effectLabel='W Кендалла')
            out['warnings'].append('p использует асимптотическое χ²; для малых n или k приближение может быть неточным.')
        elif method == 'page':
            r=stats.page_trend_test(data,method='asymptotic')
            test(out,r,'L','L = Σⱼ j·Rⱼ; p — правостороннее нормальное приближение')
            out['alternative']='increasing'
            out['steps'].append('Показатели в порядке ожидаемого возрастания. Средние ранги для совпадений; асимптотический p.')
        elif method == 'nemenyi':
            ranks=stats.rankdata(data,axis=1);mean=ranks.mean(axis=0);se=math.sqrt(k*(k+1)/(6*n));rows=[]
            for i in range(k):
                for j in range(i+1,k):
                    q=abs(mean[i]-mean[j])/se*math.sqrt(2)
                    rows.append([labels[i],labels[j],float(mean[i]-mean[j]),float(q),float(stats.studentized_range.sf(q,k,np.inf))])
            table(out,'Попарные ранговые сравнения',['Показатель 1','Показатель 2','Разность средних рангов','q','p · Немени'],rows)
            out['formula']='q = |R̄ᵢ−R̄ⱼ|/√[k(k+1)/(6n)]·√2; p — studentized range'
            out['warnings'].append('Вариант Немени для полных связанных блоков; совпадения получают средние ранги. При большом числе совпадений тест консервативен.')
        else:
            centered=data-data.mean(axis=1,keepdims=True);cov=np.cov(centered,rowvar=False);tr=np.trace(cov)
            denominator=(k-1)*np.trace(cov@cov)
            if denominator<=0:raise ValueError('Нет остаточной вариативности для ANOVA.')
            eps=float(np.clip(tr*tr/denominator,1/(k-1),1))
            grand=data.mean();ss_condition=n*np.sum((data.mean(axis=0)-grand)**2)
            ss_error=np.sum((data-data.mean(axis=1,keepdims=True)-data.mean(axis=0)+grand)**2)
            df1=k-1;df2=(n-1)*df1
            if ss_error<=np.finfo(float).eps:raise ValueError('Нулевая остаточная дисперсия.')
            f=(ss_condition/df1)/(ss_error/df2)
            out.update(statistic=float(f),statisticLabel='F',p=float(stats.f.sf(f,df1*eps,df2*eps)),df=[df1*eps,df2*eps],effect=float(ss_condition/(ss_condition+ss_error)),effectLabel='Частная η²',formula='F=MS_condition/MS_error; df_GG=ε_GG·df; ε_GG=tr(S)²/[(k−1)tr(S²)]')
            table(out,'ANOVA и поправка сферичности',['Источник','SS','df','MS'],[['Условие',ss_condition,df1,ss_condition/df1],['Ошибка',ss_error,df2,ss_error/df2]])
            out['steps'].append(f'ε Гринхауса—Гейссера={eps}; нескорректированный p={stats.f.sf(f,df1,df2)}; основной p с GG.')
            diagnostic=sphericity(data@helmert(k).T)
            table(out,'Сферичность',['W Mauchly','χ² · приближение','df','p · Mauchly','ε_GG','ε_HF','p · HF'],[[diagnostic['w'],diagnostic['chi'],diagnostic['df'],diagnostic['p'],diagnostic['gg'],diagnostic['hf'],float(stats.f.sf(f,df1*diagnostic['hf'],df2*diagnostic['hf']))]])
            out['steps'].append('Mauchly: W=|S|/(tr(S)/p)^p, χ²=−(n−1)[1−(2p²+p+2)/(6p(n−1))]ln(W). HF: ε=(npε_GG−2)/[p(n−1−pε_GG)], ограничено [1/p;1]. Основная проверка всегда GG, не выбирается по p сферичности.')
    elif method == 'jonckheere':
        if sum(map(len,arrays))>300:raise ValueError('Перестановочный критерий поддерживает до 300 наблюдений.')
        def score(*samples):
            return sum(float(np.sum(a[:,None]<b[None,:])+.5*np.sum(a[:,None]==b[None,:])) for i,a in enumerate(samples) for b in samples[i+1:])
        r=stats.permutation_test(tuple(arrays),score,permutation_type='independent',alternative='greater',n_resamples=9999,rng=np.random.default_rng(20261020))
        test(out,r,'J','J = Σᵢ<ⱼ Σₐ∈ᵢ,ᵦ∈ⱼ [I(a<b)+½I(a=b)]')
        out['alternative']='increasing';out['steps'].append('Группы по ожидаемому возрастанию; до 9999 перестановок, seed=20261020; p=(b+1)/(B+1) для Monte Carlo.')
    elif method == 'runs':
        from statsmodels.sandbox.stats.runs import runstest_1samp
        nonconstant(x);values=x[x!=np.median(x)]
        if len(values)<4:raise ValueError('После исключения равных медиане нужно не менее четырёх наблюдений.')
        z,p=runstest_1samp(values,cutoff=float(np.median(x)),correction=True)
        out.update(statistic=float(z),p=float(p),statisticLabel='z',formula='z = (R−E[R] ± 0,5)/√Var(R)')
        out['steps'].append(f'Исключено равных медиане: {len(x)-len(values)}; порядок сохранённой выборки; нормальное приближение с поправкой непрерывности.')
    elif method in ['chisquare','fisher','mcnemar']:
        aligned(arrays)
        if method == 'mcnemar':
            binary(x);binary(y);b=int(np.sum((x==0)&(y==1)));c=int(np.sum((x==1)&(y==0)))
            if b+c==0:raise ValueError('Нет несогласованных пар: сравнение изменений не определено.')
            r=stats.binomtest(b,b+c,.5)
            out.update(statistic=min(b,c),p=float(r.pvalue),statisticLabel='min(b,c)',formula='p = двусторонняя Binomial(b; b+c, ½)')
            counts=np.array([[np.sum((x==0)&(y==0)),b],[c,np.sum((x==1)&(y==1))]])
            ux=uy=np.array([0,1])
        else:
            ux=np.unique(x);uy=np.unique(y)
            if len(ux)<2 or len(uy)<2 or len(ux)*len(uy)>400:raise ValueError('Нужно от двух категорий в каждой переменной и не более 400 ячеек.')
            counts=np.array([[np.sum((x==a)&(y==b)) for b in uy] for a in ux])
            if method=='fisher':
                if counts.shape!=(2,2):raise ValueError('Для точного Фишера нужна таблица 2×2.')
                r=stats.fisher_exact(counts)
                out.update(p=float(r.pvalue),formula='p — сумма гипергеометрических вероятностей таблиц не вероятнее наблюдаемой')
                table(out,'Отношение шансов',['Показатель','Значение'],[['OR',float(r.statistic) if np.isfinite(r.statistic) else '∞ / не определено']])
            else:
                r=stats.chi2_contingency(counts,correction=False)
                out.update(statistic=float(r.statistic),p=float(r.pvalue),statisticLabel='χ²',df=int(r.dof),effect=float(np.sqrt(r.statistic/(len(x)*min(counts.shape[0]-1,counts.shape[1]-1)))),effectLabel='V Крамера',formula='χ² = Σ(O−E)²/E; Eᵢⱼ = nᵢ·nⱼ/n')
                table(out,'Ожидаемые частоты',['Строка']+[str(v) for v in uy],[[str(a)]+list(row) for a,row in zip(ux,r.expected_freq)])
                associations=[['V Крамера',out['effect']],['Коэффициент сопряжённости C',np.sqrt(r.statistic/(r.statistic+len(x)))]]
                if counts.shape==(2,2):
                    a,b,c,d=counts.ravel();phi=(float(a)*d-float(b)*c)/np.sqrt(float((a+b)*(c+d)*(a+c)*(b+d)))
                    associations.append(['φ Пирсона · направление кодов',phi])
                table(out,'Связь категорий',['Коэффициент','Значение'],associations)
                if np.min(r.expected_freq)<5:out['warnings'].append('Есть ожидаемые частоты меньше 5: χ²-приближение может быть неточным.')
        table(out,'Наблюдаемые частоты',['Строка']+[str(v) for v in uy],[[str(v)]+list(row) for v,row in zip(ux,counts)])
    elif method == 'chisquare_gof':
        values,counts=np.unique(x,return_counts=True)
        if len(values)<2:raise ValueError('Нужно не менее двух наблюдаемых категорий.')
        probabilities=np.asarray(vectors.get('probabilities') or [1/len(values)]*len(values),dtype=float)
        if len(probabilities)!=len(values) or not np.isfinite(probabilities).all() or np.any(probabilities<=0) or not np.isclose(probabilities.sum(),1,atol=1e-10,rtol=0):raise ValueError('Задайте положительную вероятность для каждой наблюдаемой категории; сумма должна быть 1.')
        expected=probabilities*len(x)
        test(out,stats.chisquare(counts,f_exp=expected),'χ²','χ² = Σ(Oᵢ−n·pᵢ)²/(n·pᵢ); заданные вероятности pᵢ')
        out['df']=len(values)-1
        table(out,'Частоты',['Категория','Наблюдается','Ожидается'],[[v,int(c),e] for v,c,e in zip(values,counts,expected)])
        out['warnings'].append('Категории, отсутствующие в данных, не включены. Гипотеза ограничена показанным набором наблюдаемых категорий.')
        if np.min(expected)<5:out['warnings'].append('Ожидаемые частоты меньше 5: χ²-приближение может быть неточным.')
    elif method in ['binomial','phi_star']:
        a=binary(x)
        if method=='binomial':
            p0=params.get('probability',.5)
            if not 0<p0<1:raise ValueError('Вероятность должна быть между 0 и 1.')
            r=stats.binomtest(a,len(x),p0);ci=r.proportion_ci(1-alpha,method='exact')
            out.update(statistic=a,statisticLabel='m',p=float(r.pvalue),effect=a/len(x),effectLabel='Доля единиц',ci=[ci.low,ci.high],ciLabel='Точный ДИ доли',formula='P(X=m)=C(n,m)p₀ᵐ(1−p₀)ⁿ⁻ᵐ; двусторонний exact p')
            out['steps'].append(f'm={a}; n={len(x)}; p₀={p0}.')
        else:
            b=binary(y)
            if min(a,len(x)-a,b,len(y)-b)<5:raise ValueError('Для углового приближения нужно минимум пять исходов каждого вида в обеих группах.')
            z=(2*np.arcsin(np.sqrt(a/len(x)))-2*np.arcsin(np.sqrt(b/len(y))))*np.sqrt(len(x)*len(y)/(len(x)+len(y)))
            out.update(statistic=float(z),statisticLabel='φ*',p=float(2*stats.norm.sf(abs(z))),effect=a/len(x)-b/len(y),effectLabel='Разность долей',formula='φ*=[2arcsin√p₁−2arcsin√p₂]√[n₁n₂/(n₁+n₂)]')
    elif method in ['pointbiserial','biserial','eta']:
        aligned(arrays);nonconstant(y)
        if method in ['pointbiserial','biserial']:
            successes=binary(x);nonconstant(x);r=stats.pointbiserialr(x,y)
            test(out,r,'r_pb','r_pb = Pearson(binary, numeric)')
            if method=='biserial':
                proportion=successes/len(x);coefficient=r.statistic*np.sqrt(proportion*(1-proportion))/stats.norm.pdf(stats.norm.ppf(proportion))
                out.update(statistic=float(coefficient),statisticLabel='r_b',p=None,formula='r_b = r_pb·√[pq]/φ(Φ⁻¹(p))')
                out['warnings'].append('Предполагается скрытая нормальная переменная. Оценка может выходить за ±1 при нарушении модели; p не рассчитывается.')
        else:
            categories=np.unique(x)
            if len(categories)<2 or len(categories)>=len(x):raise ValueError('Нужны повторяющиеся категории группового фактора.')
            groups=[y[x==v] for v in categories]
            ssb=sum(len(a)*(a.mean()-y.mean())**2 for a in groups);sst=np.sum((y-y.mean())**2)
            out.update(statistic=float(np.sqrt(ssb/sst)),statisticLabel='η',effect=float(ssb/sst),effectLabel='η²',formula='η² = SS_between/SS_total; η=√η²')
            r=stats.f_oneway(*groups);out['p']=float(r.pvalue)
        out['effect']=out.get('effect') if out.get('effect') is not None else out['statistic']
        out['effectLabel']=out.get('effectLabel','Коэффициент связи')
    elif method == 'rankbiserial':
        r=stats.mannwhitneyu(x,y,method='asymptotic')
        out.update(statistic=float(2*r.statistic/(len(x)*len(y))-1),statisticLabel='r_rb',p=float(r.pvalue),formula='r_rb = 2U₁/(n₁n₂)−1')
        out['steps'].append('Двусторонний p Манна—Уитни, асимптотический с поправками на ties и непрерывность.')
    elif method == 'welch_anova':
        for a in arrays:nonconstant(a)
        test(out,stats.f_oneway(*arrays,equal_var=False),'F_W','wᵢ=nᵢ/sᵢ²; F_W — взвешенная дисперсия средних с поправкой Welch')
        n=np.array(list(map(len,arrays)));w=np.array([len(a)/a.var(ddof=1) for a in arrays]);k=len(arrays)
        out['df']=[k-1,float((k*k-1)/(3*np.sum((1-w/w.sum())**2/(n-1))))]
    elif method == 'paired_posthoc':
        aligned(arrays,3);rows=[];pvalues=[]
        for i in range(len(arrays)):
            for j in range(i+1,len(arrays)):
                d=arrays[i]-arrays[j]
                if not np.any(d):statistic,p=0.,1.
                else:
                    r=stats.wilcoxon(d,zero_method='wilcox',correction=False,method='approx');statistic,p=float(r.statistic),float(r.pvalue)
                rows.append([labels[i],labels[j],statistic,p]);pvalues.append(p)
        table(out,'Парные сравнения',['Показатель 1','Показатель 2','T','p','p · Холм'],[row+[float(p)] for row,p in zip(rows,multipletests(pvalues,method='holm')[1])])
        out['formula']='T=min(W₊,W₋); нулевые разности исключены; асимптотический p; Holm по всем парам'
        out['warnings'].append('При малом числе ненулевых разностей асимптотический p может быть неточным. Полностью совпадающие замеры имеют p=1.')
    elif method == 'scheffe':
        n=sum(map(len,arrays));k=len(arrays);df=n-k;mse=sum(np.sum((a-a.mean())**2) for a in arrays)/df
        if mse<=0:raise ValueError('Нет внутригрупповой вариативности для Шеффе.')
        critical=np.sqrt((k-1)*stats.f.ppf(1-alpha,k-1,df));rows=[]
        for i in range(k):
            for j in range(i+1,k):
                difference=arrays[i].mean()-arrays[j].mean();se=np.sqrt(mse*(1/len(arrays[i])+1/len(arrays[j])))
                f=difference**2/(se**2*(k-1));p=stats.f.sf(f,k-1,df)
                rows.append([labels[i],labels[j],difference,p,difference-critical*se,difference+critical*se])
        table(out,'Контрасты Шеффе',['Группа 1','Группа 2','Разность','p · Шеффе','ДИ от','ДИ до'],rows)
        out['formula']='F_S=(Mᵢ−Mⱼ)²/[(k−1)MSE(1/nᵢ+1/nⱼ)]; F(k−1,N−k)'
    elif method in ['tukey','games_howell','dunn']:
        if method=='dunn':
            combined=np.concatenate(arrays);nonconstant(combined);ranks=stats.rankdata(combined);n=len(combined)
            _,ties=np.unique(combined,return_counts=True);variance=n*(n+1)/12-np.sum(ties**3-ties)/(12*(n-1))
            means=[];offset=0
            for a in arrays:means.append(ranks[offset:offset+len(a)].mean());offset+=len(a)
            rows=[];pvalues=[]
            for i in range(len(arrays)):
                for j in range(i+1,len(arrays)):
                    z=(means[i]-means[j])/math.sqrt(variance*(1/len(arrays[i])+1/len(arrays[j])))
                    p=float(2*stats.norm.sf(abs(z)));pvalues.append(p);rows.append([labels[i],labels[j],float(z),p])
            corrected=multipletests(pvalues,method='holm')[1]
            table(out,'Сравнения Данна',['Группа 1','Группа 2','z','p','p · Холм'],[row+[float(p)] for row,p in zip(rows,corrected)])
            out['formula']='z=(R̄ᵢ−R̄ⱼ)/√[V_ties(1/nᵢ+1/nⱼ)]; поправка Холма по всем парам'
        else:
            if method=='games_howell':
                for a in arrays:nonconstant(a)
            r=stats.tukey_hsd(*arrays,equal_var=method=='tukey');ci=r.confidence_interval(1-alpha)
            table(out,'Попарные разности средних',['Группа 1','Группа 2','Разность','p · семейство','ДИ от','ДИ до'],
                  [[labels[i],labels[j],float(r.statistic[i,j]),float(r.pvalue[i,j]),float(ci.low[i,j]),float(ci.high[i,j])] for i in range(len(arrays)) for j in range(i+1,len(arrays))])
            out['formula']='q — studentized range; одновременные ДИ разностей средних'
            out['steps'].append('Равные дисперсии: '+str(method=='tukey')+'. Все пары входят в одно семейство.')
    else:
        from models import calculate_model
        calculate_model(request, arrays, out)
    out['steps'].append('Реализация: SciPy / statsmodels / scikit-learn; версии сохранены в отчёте.')
    return out
