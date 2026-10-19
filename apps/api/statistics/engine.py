"""Versioned JSON-in/JSON-out pilot engine. No user-supplied code is evaluated."""
import json
import math
import sys
import warnings
import hashlib
from pathlib import Path
import scipy
import numpy as np
from scipy import stats

VERSION = 'statistics-2'


def calculate(request):
    method = request['method']
    alpha = request.get('alpha', 0.05)
    if method in ['mds_matrix_classical','mds_matrix_nonmetric','mds_individual','mds_preference','cluster_matrix']:
        from matrices import calculate_matrix
        out = {'engine': VERSION, 'scipy': scipy.__version__, 'numpy': np.__version__, 'python': sys.version.split()[0],
               'summary': [], 'warnings': [], 'formula': '', 'steps': [], 'statistic': None, 'p': None, 'effect': None,
               'ci': None, 'df': None, 'alternative': 'not-applicable', 'alpha': alpha}
        if not 0 < alpha < 1:raise ValueError('Некорректный уровень значимости.')
        return clean(calculate_matrix(request,out))
    groups = request['groups']
    arrays = [np.asarray(g['values'], dtype=float) for g in groups]
    if not 0 < alpha < 1 or not arrays or any(not np.isfinite(a).all() for a in arrays):
        raise ValueError('Некорректные числовые данные или уровень значимости.')
    if any(a.ndim != 1 or len(a) < 2 for a in arrays):
        raise ValueError('Нужно не менее двух пригодных наблюдений в каждой группе.')
    if sum(map(len, arrays)) > 20000:
        raise ValueError('Пилот поддерживает не более 20 000 значений за один расчёт.')
    summary = []
    for group, a in zip(groups, arrays):
        summary.append({'label': group['label'], 'n': len(a), 'mean': float(a.mean()),
                        'median': float(np.median(a)), 'sd': float(a.std(ddof=1)),
                        'variance': float(a.var(ddof=1)), 'min': float(a.min()), 'max': float(a.max()),
                        'q1': float(np.quantile(a, .25)), 'q3': float(np.quantile(a, .75))})
    out = {'engine': VERSION, 'scipy': scipy.__version__, 'numpy': np.__version__,
           'python': sys.version.split()[0], 'summary': summary, 'warnings': [],
           'formula': '', 'steps': [], 'statistic': None, 'p': None, 'effect': None,
           'ci': None, 'df': None, 'alternative': 'two-sided', 'alpha': alpha}
    x = arrays[0]
    y = arrays[1] if len(arrays) > 1 else None
    expected = {'descriptive': 1, 'shapiro': 1, 't_one': 1, 't_paired': 2, 'welch': 2,
                'pearson': 2, 'spearman': 2, 'kendall': 2, 'mannwhitney': 2, 'wilcoxon': 2, 'sign': 2}
    if method in expected and len(arrays) != expected[method]:
        raise ValueError('Некорректное число входных переменных/групп.')
    if method in ['kruskal', 'anova'] and len(arrays) < 2:
        raise ValueError('Выберите не менее двух групп.')
    paired = method in ['pearson', 'spearman', 'kendall', 't_paired', 'wilcoxon', 'sign']
    if paired and len(x) != len(y):
        raise ValueError('Для связанных показателей нужны полные пары.')
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        if method == 'descriptive':
            from extended import table
            out['formula'] = 'M = Σx / n; s² = Σ(x − M)² / (n − 1); s = √s²'
            values, counts = np.unique(x, return_counts=True)
            out['modes'] = values[counts == counts.max()].tolist() if counts.max()>1 else []
            out['modeFrequency'] = int(counts.max())
            out['steps'] = [f'Сумма = {float(x.sum())}', f'Σ(x − M)² = {float(((x-x.mean())**2).sum())}',
                            'Квартили: линейная интерполяция NumPy (method=linear).',
                            'Моды — все повторяющиеся значения с максимальной частотой; если повторений нет, модальная группа не выделяется.',
                            'ДИ среднего: M ± t(1 − α/2, n−1) · s/√n; это интервал в рамках нормальной модели среднего.']
            if len(x) >= 3 and x.std() > 0:
                out['skewness'] = float(stats.skew(x, bias=False))
                out['steps'].append('Асимметрия: G₁ = √[n(n−1)]/(n−2) · m₃/m₂^(3/2), где mₖ = Σ(x−M)^k/n.')
            if len(x) >= 4 and x.std() > 0:
                out['excess'] = float(stats.kurtosis(x, fisher=True, bias=False))
                out['steps'].append('Эксцесс: G₂ = (n−1)/[(n−2)(n−3)] · [(n+1)(m₄/m₂² − 3) + 6].')
            out['ci'] = list(map(float, stats.t.interval(1-alpha, len(x)-1, loc=x.mean(), scale=stats.sem(x)))) if x.std() > 0 else [float(x.mean())]*2
            out['ciLabel'] = 'Доверительный интервал среднего'
            table(out,'Дополнительные описательные показатели',['Показатель','Значение'],[['Стандартная ошибка среднего',float(stats.sem(x))],['Генеральная дисперсия · делитель n',float(x.var(ddof=0))],['Генеральное SD · делитель n',float(x.std(ddof=0))],['Размах',float(np.ptp(x))]])
            table(out,'Процентили · линейная интерполяция',['Процентиль','Значение'],[[q,float(np.quantile(x,q/100))] for q in [5,10,25,50,75,90,95]])
            n=len(x)
            if 'skewness' in out:
                se=math.sqrt(6*n*(n-1)/((n-2)*(n+1)*(n+3)))
                table(out,'Стандартная ошибка асимметрии',['Показатель','Значение'],[['SE(G₁)',se]])
                out['steps'].append('SE(G₁)=√[6n(n−1)/((n−2)(n+1)(n+3))], стандартная ошибка в нормальной модели.')
            if 'excess' in out:
                se=math.sqrt(24*n*(n-1)**2/((n-3)*(n-2)*(n+3)*(n+5)))
                table(out,'Стандартная ошибка эксцесса',['Показатель','Значение'],[['SE(G₂)',se]])
                out['steps'].append('SE(G₂)=√[24n(n−1)²/((n−3)(n−2)(n+3)(n+5))], нормальная модель.')
        elif method == 'shapiro':
            if len(x) < 3 or len(x) > 5000 or np.ptp(x) == 0:
                raise ValueError('Для Шапиро—Уилка нужно 3–5000 значений с ненулевой вариативностью.')
            r = stats.shapiro(x)
            out.update(statistic=float(r.statistic), p=float(r.pvalue), statisticLabel='W')
            out['formula'] = 'W = (Σ aᵢ x₍ᵢ₎)² / Σ(xᵢ − M)²'
            out['steps'] = ['Порядковые статистики x₍ᵢ₎ получены сортировкой входных значений.',
                            'Коэффициенты aᵢ и p: реализация алгоритма AS R94 в scipy.stats.shapiro.',
                            'p выше α не доказывает нормальность распределения.']
        elif method in ['welch', 't_one', 't_paired']:
            if method == 'welch':
                v1, v2 = x.var(ddof=1)/len(x), y.var(ddof=1)/len(y)
                se = math.sqrt(v1+v2)
                if se == 0:
                    raise ValueError('Нельзя оценить ошибку разности: обе дисперсии равны нулю.')
                df = (v1+v2)**2/(v1*v1/(len(x)-1)+v2*v2/(len(y)-1))
                difference = float(x.mean()-y.mean())
                r = stats.ttest_ind(x, y, equal_var=False)
                out['formula'] = 't = (M₁ − M₂) / √(s₁²/n₁ + s₂²/n₂); df — Welch–Satterthwaite'
                out['steps'] = [f's₁²/n₁ = {v1}', f's₂²/n₂ = {v2}', f'SE = {se}']
            else:
                mu = float(request.get('mu', 0))
                a = x-y if method == 't_paired' else x
                if a.std(ddof=1) == 0:
                    raise ValueError('Нулевая дисперсия значений/разностей: t-критерий не определён.')
                reference = 0 if method == 't_paired' else mu
                r = stats.ttest_1samp(a, reference)
                df, se, difference = len(a)-1, float(stats.sem(a)), float(a.mean()-reference)
                out['formula'] = 't = (M − μ₀) / (s / √n)' if method == 't_one' else 'dᵢ = xᵢ − yᵢ; t = M_d / (s_d / √n)'
                out['steps'] = [f'Проверяемое значение = {reference}', f'Среднее анализируемых значений/разностей = {float(a.mean())}', f'Sтандартная ошибка = {se}']
            margin = float(stats.t.ppf(1-alpha/2, df))*se
            out.update(statistic=float(r.statistic), p=float(r.pvalue), statisticLabel='t', df=float(df),
                       effect=difference, effectLabel='Разность средних (первое − второе/μ₀)',
                       ci=[difference-margin, difference+margin], ciLabel='ДИ разности средних')
        elif method in ['pearson', 'spearman', 'kendall']:
            if np.ptp(x) == 0 or np.ptp(y) == 0 or len(x) < 3:
                raise ValueError('Для корреляции нужны не менее трёх полных пар и вариативность обоих показателей.')
            if method == 'pearson':
                r = stats.pearsonr(x, y)
                out['formula'] = 'r = Σ[(x − Mx)(y − My)] / √[Σ(x − Mx)² Σ(y − My)²]'
                ci = r.confidence_interval(confidence_level=1-alpha)
                if len(x) > 3:
                    out.update(ci=[float(ci.low), float(ci.high)], ciLabel='ДИ r: преобразование Фишера')
                out['steps'] = [f'Σ[(x − Mx)(y − My)] = {float(((x-x.mean())*(y-y.mean())).sum())}',
                                'Двусторонний p: точное beta-распределение r при нулевой корреляции и нормальной модели.']
            elif method == 'spearman':
                r = stats.spearmanr(x, y)
                out['formula'] = 'ρ = Pearson(rank(x), rank(y)); одинаковым значениям присваивается средний ранг'
                out['ranks'] = [stats.rankdata(x).tolist(), stats.rankdata(y).tolist()]
                out['steps'] = ['p рассчитан асимптотически scipy.stats.spearmanr; связанным значениям присвоены средние ранги.']
                if len(x) < 500:
                    out['warnings'].append('Для небольших выборок асимптотический p Спирмена может быть неточным. В пилоте перестановочный вариант пока не поддержан.')
            else:
                ties = len(set(x)) < len(x) or len(set(y)) < len(y)
                algorithm = 'exact' if not ties and len(x)<=33 else 'asymptotic'
                r = stats.kendalltau(x, y, variant='b', method=algorithm)
                out['formula'] = 'τ_b = (P − Q) / √[(P + Q + T)(P + Q + U)]'
                out['steps'] = ['P/Q — согласованные/несогласованные пары; T/U — совпадения только по одному показателю.',
                                f'Алгоритм p: {algorithm}; scipy.stats.kendalltau(variant=b).']
            out.update(statistic=float(r.statistic), statisticLabel={'pearson':'r','spearman':'ρ','kendall':'τ-b'}[method],
                       p=float(r.pvalue), effect=float(r.statistic), effectLabel='Коэффициент связи')
        elif method == 'mannwhitney':
            combined = np.concatenate([x,y]); ranks = stats.rankdata(combined)
            ties = len(set(combined)) < len(combined)
            algorithm = 'exact' if min(len(x),len(y)) <= 8 and not ties else 'asymptotic'
            r = stats.mannwhitneyu(x, y, alternative='two-sided', method=algorithm, use_continuity=True)
            u1 = float(r.statistic); u2 = len(x)*len(y)-u1
            out.update(statistic=u1, statisticLabel='U₁', p=float(r.pvalue), effect=2*u1/(len(x)*len(y))-1,
                       effectLabel='Рангово-бисериальная связь (положительно: первая группа выше)', ranks=[ranks[:len(x)].tolist(), ranks[len(x):].tolist()])
            out['formula'] = 'U₁ = R₁ − n₁(n₁+1)/2; U₂ = n₁n₂ − U₁'
            out['steps'] = [f'R₁ = {float(ranks[:len(x)].sum())}; R₂ = {float(ranks[len(x):].sum())}',
                            f'U₁ = {u1}; U₂ = {u2}', f'p: {algorithm}; для asymptotic — поправки на совпадения и непрерывность 0,5.']
            if ties and min(len(x),len(y)) < 10:
                out['warnings'].append('Малая группа и связанные ранги: асимптотический p может быть неточным.')
        elif method in ['wilcoxon', 'sign']:
            d = x-y; nonzero = d[d != 0]
            if not len(nonzero):
                raise ValueError('Все парные разности равны нулю. Критерий не рассчитывается.')
            positive, negative = int((d>0).sum()), int((d<0).sum())
            out['steps'] = [f'Положительных разностей: {positive}; отрицательных: {negative}; нулевых: {len(d)-len(nonzero)}.', 'Нулевые разности исключены из ранжирования/биномиального расчёта.']
            if method == 'sign':
                r = stats.binomtest(positive, len(nonzero), .5, alternative='two-sided')
                out.update(statistic=min(positive,negative), statisticLabel='G', p=float(r.pvalue), effect=(positive-negative)/len(nonzero), effectLabel='Баланс направлений сдвига')
                out['formula'] = 'G = min(n₊, n₋); p — двусторонняя Binomial(n₊ + n₋, 0,5)'
            else:
                # Explicit algorithm avoids version-dependent auto/permutation selection.
                tied = len(set(abs(nonzero))) < len(nonzero)
                algorithm = 'exact' if not tied and len(nonzero)==len(d) and len(d)<=50 else 'approx'
                r = stats.wilcoxon(d, zero_method='wilcox', correction=False, alternative='two-sided', method=algorithm)
                ranks = stats.rankdata(abs(nonzero)); wp=float(ranks[nonzero>0].sum()); wm=float(ranks[nonzero<0].sum())
                out.update(statistic=float(r.statistic), statisticLabel='T = min(W₊, W₋)', p=float(r.pvalue), effect=(wp-wm)/(wp+wm), effectLabel='Парный рангово-бисериальный эффект', ranks=[ranks.tolist()])
                out['formula'] = 'T = min(Σ rank(|d|) при d>0, Σ rank(|d|) при d<0)'
                out['steps'] += [f'W₊ = {wp}; W₋ = {wm}; p: {algorithm}; поправка непрерывности выключена.']
                if algorithm == 'approx' and len(nonzero) < 10:
                    out['warnings'].append('Мало ненулевых разностей: асимптотический p может быть неточным.')
        elif method == 'kruskal':
            if np.ptp(np.concatenate(arrays)) == 0:
                raise ValueError('Все значения одинаковы: критерий H не определён.')
            r = stats.kruskal(*arrays)
            out.update(statistic=float(r.statistic), statisticLabel='H', p=float(r.pvalue), df=len(arrays)-1)
            out['formula'] = 'H = [12 / (N(N+1)) · Σ(Rⱼ²/nⱼ) − 3(N+1)] / C_ties'
            out['steps'] = ['Средние ранги по объединённым значениям; поправка на связанные ранги.', 'p — асимптотическое χ² с k−1 степенями свободы; post-hoc в пилоте не выполняется.']
            if min(map(len,arrays)) < 5:
                out['warnings'].append('В группе меньше пяти наблюдений: асимптотическое приближение может быть неточным.')
        elif method == 'anova':
            r = stats.f_oneway(*arrays)
            out.update(statistic=float(r.statistic), statisticLabel='F', p=float(r.pvalue), df=[len(arrays)-1,sum(map(len,arrays))-len(arrays)])
            out['formula'] = 'F = MS_between / MS_within; MS = SS / df'
            grand=float(np.concatenate(arrays).mean()); ssb=sum(len(a)*(a.mean()-grand)**2 for a in arrays); ssw=sum(((a-a.mean())**2).sum() for a in arrays)
            out.update(effect=float(ssb/(ssb+ssw)), effectLabel='η²')
            out['steps'] = [f'Общее среднее = {grand}; SS_between = {float(ssb)}; SS_within = {float(ssw)}', 'Классический независимый однофакторный ANOVA; предполагаются независимость, подходящая модель остатков и равенство дисперсий.']
            out['warnings'].append('Проверьте допущения ANOVA. Post-hoc и автоматическая диагностика остатков в пилоте не выполняются.')
        else:
            from extended import calculate_extended
            calculate_extended(request, arrays, out)
        out['warnings'] += [str(w.message) for w in caught]
    if out['p'] is not None and (not math.isfinite(out['p']) or (out['statistic'] is not None and not math.isfinite(out['statistic']))):
        raise ValueError('На этих данных статистика не определена. Проверьте вариативность и состав групп.')
    return clean(out)


def clean(value):
    if isinstance(value, (complex, np.complexfloating)):
        if abs(value.imag) > 1e-10:
            raise ValueError('Получено комплексное решение вместо вещественного. Проверьте матрицу показателей.')
        return clean(value.real)
    if isinstance(value, dict):
        if value.get('engine') == VERSION:
            value['references'] = [
                {'title': 'SciPy · статистические процедуры и определения', 'url': 'https://docs.scipy.org/doc/scipy/reference/stats.html'},
                {'title': 'statsmodels · модели, диагностика, факторный анализ', 'url': 'https://www.statsmodels.org/stable/index.html'},
                {'title': 'scikit-learn · LDA, отбор, MDS', 'url': 'https://scikit-learn.org/stable/modules/classes.html'},
            ]
            value['implementation'] = hashlib.sha256(b''.join((Path(__file__).parent/name).read_bytes() for name in ['engine.py','extended.py','models.py','matrices.py','diagnostics.py'])).hexdigest()
        return {str(k): clean(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, np.ndarray)):
        return [clean(v) for v in value]
    if isinstance(value, (np.integer, np.bool_)):
        return value.item()
    if isinstance(value, (float, np.floating)):
        if not math.isfinite(value):
            raise ValueError('На этих данных возникла неопределённая оценка. Проверьте вариативность, объём и зависимость показателей.')
        return float(value)
    return value


if __name__ == '__main__':
    try:
        print(json.dumps({'result': calculate(json.load(sys.stdin))}, ensure_ascii=False, allow_nan=False))
    except (ValueError, KeyError, TypeError, np.linalg.LinAlgError) as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False))
        sys.exit(0)
