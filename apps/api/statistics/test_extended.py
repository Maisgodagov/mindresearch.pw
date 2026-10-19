import json
import unittest
import numpy as np
from scipy import stats
from engine import calculate


def run(method, arrays, _vectors=None, **parameters):
    return calculate(dict(method=method, alpha=.05, parameters=parameters, vectors=_vectors or {},
        groups=[dict(label=str(i+1),values=list(a)) for i,a in enumerate(arrays)]))


class ExtendedTests(unittest.TestCase):
    def test_every_registered_extension_returns_finite_trace(self):
        import re
        source=(__import__('pathlib').Path(__file__).parents[1]/'src/statistics/extended-methods.ts').read_text(encoding='utf-8')
        methods=json.loads(source.split('export const extendedMethods: StatisticsMethod[] =',1)[1].strip().rstrip(';'))
        rng=np.random.default_rng(71)
        a=rng.normal(size=60);b=.3*a+rng.normal(size=60);c=rng.normal(size=60)
        for method in methods:
            name=method['id']
            if method['kind']=='manual':continue
            arrays=[a] if method['kind']=='single' else [a,b,c] if method['kind'] in ['multiple','repeated','multivariate'] else [a,b]
            if name in ['compare_correlations','factorial_anova']:arrays=[a,b,c]
            if name in ['chisquare','fisher','mcnemar']:arrays=[np.tile([0,1,1,0,0,1],10),np.tile([1,1,0,0,1,1],10)]
            if name in ['binomial','sample_size_proportion']:arrays=[np.tile([0,1,1],20)]
            if name=='phi_star':arrays=[np.tile([0,1],30),np.tile([0,1,1],20)]
            if name in ['pointbiserial','biserial','eta']:arrays=[np.tile([0,1],30),a]
            if name in ['frequency','chisquare_gof']:arrays=[np.tile([0,1,2],20)]
            if name in ['manova','discriminant','discriminant_stepwise','box_m']:arrays=[np.repeat([0,1,2],20),a,b]
            if name in ['efa_pa','efa_ml','efa_uls','efa_gls']:
                latent=np.random.default_rng(75).normal(size=300)
                arrays=[latent+np.random.default_rng(j).normal(scale=.7,size=300) for j in [10,11,12,13,14]]
            if name=='factorial_anova':arrays=[a,np.repeat([0,1],30),np.tile(np.repeat([0,1],15),2)]
            if name.startswith('regression'):arrays=[np.exp(a),np.exp(b),np.exp(c)] if method['kind']=='multivariate' else [np.exp(a),np.exp(b)]
            if name=='repeated_factorial':arrays=[a,b,c,rng.normal(size=60)]
            if name=='mixed_anova':arrays=[np.repeat([0,1],30),a,b,c]
            if name.startswith('difference_'):arrays=[a,b,c,rng.normal(size=60)]
            if name=='compare_independent_correlations':arrays=[a,b,c,rng.normal(size=60)]
            if name=='rosenbaum':arrays=[a[:15],b[:15]]
            if name=='jonckheere':arrays=[a[:8],b[:8],c[:8]]
            if name=='mds_nonmetric':arrays=[a[:15],b[:15],c[:15]]
            with self.subTest(method=name):
                result=run(name,arrays,_vectors={'weights':[-1,0,1]} if name=='contrast' else {},**{p['key']:p['value'] for p in method.get('parameters',[])})
                self.assertTrue(result['formula'])
                self.assertTrue(result['steps'])
                json.dumps(result,allow_nan=False)
                self.assertTrue(result['p'] is None or 0<=result['p']<=1)

    def test_friedman_published_scipy_example(self):
        result=run('friedman',np.random.default_rng(18).random((6,10)))
        self.assertAlmostEqual(result['statistic'],11.428571428571416)
        self.assertAlmostEqual(result['p'],.043514520866727614)

    def test_frequency_ranks_and_standardization(self):
        result=run('frequency',[[1,1,2,3]])
        self.assertEqual(result['tables'][0]['rows'][0],[1,2,.5,2,.5])
        ranks=run('ranks',[[1,2,2,4]])['tables'][0]['rows']
        self.assertEqual([r[2] for r in ranks],[1,2.5,2.5,4])
        z=run('standardize',[[1,2,3,4]])['tables'][0]['rows']
        self.assertAlmostEqual(np.std([r[2] for r in z],ddof=1),1)

    def test_binary_exact_probabilities(self):
        self.assertAlmostEqual(run('binomial',[[1,1,1,1]])['p'],.125)
        self.assertAlmostEqual(run('mcnemar',[[0,0,0,0],[1,1,1,1]])['p'],.125)
        x=[0]*8+[1]*7;y=[0]*6+[1]*2+[0]+[1]*6
        self.assertAlmostEqual(run('fisher',[x,y])['p'],.04055944055944057)

    def test_pooled_t_manual_formula_and_reversal(self):
        a=np.array([1.,2,3,4]);b=np.array([3.,5,7,9])
        result=run('t_independent',[a,b]);variance=((3*a.var(ddof=1)+3*b.var(ddof=1))/6)
        self.assertAlmostEqual(result['statistic'],(a.mean()-b.mean())/np.sqrt(variance*.5))
        reverse=run('t_independent',[b,a]);self.assertAlmostEqual(result['p'],reverse['p'])
        self.assertAlmostEqual(result['effect'],-reverse['effect'])

    def test_pca_reconstructs_correlation_matrix(self):
        rng=np.random.default_rng(91);data=rng.normal(size=(30,3))
        result=run('pca',data.T,components=3)
        loadings=np.array([row[1:] for row in next(t for t in result['tables'] if t['title']=='Нагрузки')['rows']])
        np.testing.assert_allclose(loadings@loadings.T,np.corrcoef(data,rowvar=False),atol=1e-12)

    def test_holm_and_tukey_families(self):
        a=[1,2,4,6,8];b=[2,4,6,8,9];c=[8,9,10,11,13]
        rows=run('dunn',[a,b,c])['tables'][0]['rows']
        self.assertEqual(len(rows),3)
        for row in rows:self.assertGreaterEqual(row[-1],row[-2])
        rows=run('tukey',[a,b,c])['tables'][0]['rows']
        for row in rows:self.assertLessEqual(row[4],row[2]);self.assertGreaterEqual(row[5],row[2])

    def test_guards_reject_bad_models(self):
        cases=[('regression',[[1,2,3,4],[2,2,2,2]],{}),('pca',[[1,2,3,4],[2,4,6,8]],{}),('binomial',[[0,1,2]],{}),('phi_star',[[0,0,1],[0,1,1]],{}),('mds_classical',[[1,2],[3,5]],{'components':2})]
        for method,arrays,params in cases:
            with self.subTest(method=method),self.assertRaises(ValueError):run(method,arrays,**params)

    def test_two_factor_repeated_matches_independent_anovarm_implementation(self):
        import pandas as pd
        from statsmodels.stats.anova import AnovaRM
        rng=np.random.default_rng(19);data=rng.normal(size=(24,4))+[0,.5,1,2]
        result=run('repeated_factorial',data.T,levelsA=2)
        rows=result['tables'][0]['rows']
        frame=pd.DataFrame([dict(subject=i,a=j//2,b=j%2,value=data[i,j]) for i in range(24) for j in range(4)])
        reference=AnovaRM(frame,'value','subject',within=['a','b']).fit().anova_table
        for row,key in zip(rows,['a','b','a:b']):self.assertAlmostEqual(row[5],reference.loc[key,'F Value'],places=10)

    def test_mauchly_and_epsilon_published_example(self):
        from diagnostics import sphericity
        from scipy.linalg import helmert
        data=np.array([[2.2,1.1,8.2],[3.1,2.5,4.5],[4.3,4.1,3.4],[4.1,5.2,6.2],[7.2,6.4,7.2]])
        result=sphericity(data@helmert(3).T)
        self.assertAlmostEqual(result['w'],.210,places=3)
        self.assertAlmostEqual(result['chi'],4.677,places=3)
        self.assertAlmostEqual(result['p'],.096,places=3)
        self.assertAlmostEqual(result['gg'],.56,places=2)
        self.assertAlmostEqual(result['hf'],.62,places=2)

    def test_matrix_algorithms_recover_synthetic_geometry(self):
        from scipy.spatial.distance import cdist,pdist,squareform
        points=np.array([[0.,0.],[1,0],[0,2],[2,2],[3,1]])
        distances=squareform(pdist(points))
        def matrix_run(method,data):return calculate(dict(method=method,alpha=.05,parameters={'components':2},groups=[],matrixData=np.asarray(data).tolist()))
        result=matrix_run('mds_matrix_classical',distances)
        coordinates=np.array([row[1:] for row in result['tables'][-1]['rows']])
        np.testing.assert_allclose(squareform(pdist(coordinates)),distances,atol=1e-10)
        matrices=[squareform(pdist(points*np.sqrt(weights))) for weights in [[1,2],[3,.5],[.5,1]]]
        result=matrix_run('mds_individual',matrices)
        quality=result['tables'][-1]['rows'][0][1]
        self.assertLess(quality,1e-4)
        preferences=cdist(points[:3],points[2:])
        result=matrix_run('mds_preference',preferences)
        self.assertLess(result['tables'][-1]['rows'][0][1],1e-4)
        result=matrix_run('mds_matrix_nonmetric',distances)
        self.assertTrue(result['formula'])
        for method,data in [('mds_matrix_classical',[[0,2,3],[1,0,1],[3,1,0]]),('mds_individual',[distances,distances[:-1,:-1]])]:
            with self.assertRaises(ValueError):matrix_run(method,data)

    def test_oblique_rotation_preserves_fitted_covariance(self):
        rng=np.random.default_rng(81);latent=rng.normal(size=(200,2))
        values=latent@np.array([[.8,.7,.8,0,0,0],[0,0,0,.8,.7,.8]])+rng.normal(scale=.4,size=(200,6))
        base=run('efa_pa',values.T,components=2,rotation=0)
        rotated=run('efa_pa',values.T,components=2,rotation=4)
        def covariance(result):
            loadings=np.array([row[1:] for row in next(t for t in result['tables'] if t['title']=='Нагрузки')['rows']])
            phi=np.array([row[1:] for row in next(t for t in result['tables'] if t['title']=='Корреляции факторов')['rows']])
            return loadings@phi@loadings.T
        np.testing.assert_allclose(covariance(base),covariance(rotated),atol=1e-8)


if __name__=='__main__':unittest.main()
