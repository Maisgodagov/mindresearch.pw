import math
import unittest
from engine import calculate


def run(method, *groups, **kwargs):
    return calculate(dict(method=method, alpha=.05, groups=[dict(label=str(i), values=x) for i,x in enumerate(groups)], **kwargs))


class EngineTests(unittest.TestCase):
    def test_descriptive_sample_variance_and_ci(self):
        r=run('descriptive',[1,2,3,4])
        self.assertEqual(r['summary'][0]['mean'],2.5)
        self.assertAlmostEqual(r['summary'][0]['variance'],5/3)
        self.assertAlmostEqual(r['ci'][0],.4457397432,places=8)
        self.assertEqual(run('descriptive',[0,0])['ci'],[0,0])
        self.assertEqual(run('descriptive',[1,2,2,3,3])['modes'],[2,3])
        self.assertEqual(run('descriptive',[1,2,3])['modes'],[])

    def test_published_scipy_mannwhitney_example(self):
        r=run('mannwhitney',[19,22,16,29,24],[20,11,17,12])
        self.assertEqual(r['statistic'],17)
        self.assertAlmostEqual(r['p'],1/9)
        self.assertAlmostEqual(r['effect'],.7)
        self.assertIn('exact',r['steps'][-1])

    def test_student_t_formula_and_pairing(self):
        r=run('t_one',[1,2,3,4],mu=0)
        self.assertAlmostEqual(r['statistic'],3.872983346207417)
        self.assertEqual(r['df'],3)
        paired=run('t_paired',[5,7,11,9],[4,5,8,5])
        self.assertAlmostEqual(paired['statistic'],r['statistic'])
        self.assertAlmostEqual(paired['effect'],2.5)

    def test_welch_handles_unequal_variance_and_reverses_direction(self):
        a,b=[1,2,3,4],[4,8,10,15,16]
        x,y=run('welch',a,b),run('welch',b,a)
        self.assertAlmostEqual(x['p'],y['p'])
        self.assertAlmostEqual(x['statistic'],-y['statistic'])
        self.assertAlmostEqual(x['effect'],-y['effect'])

    def test_correlations_and_ties(self):
        self.assertAlmostEqual(run('pearson',[1,2,3,4],[8,6,4,2])['statistic'],-1)
        self.assertAlmostEqual(run('spearman',[1,2,2,4],[4,2,2,1])['statistic'],-1)
        self.assertAlmostEqual(run('kendall',[1,2,2,4],[4,2,2,1])['statistic'],-1)

    def test_sign_excludes_zero_and_uses_two_sided_exact_probability(self):
        r=run('sign',[1,2,3,4,0],[0,0,0,0,0])
        self.assertEqual(r['statistic'],0)
        self.assertEqual(r['p'],.125)

    def test_all_methods_have_finite_result_and_trace(self):
        a,b,c=[1,2,3,4,6,8],[2,4,3,7,9,10],[3,4,8,9,11,14]
        for method in ['descriptive','shapiro','t_one','welch','t_paired','pearson','spearman','kendall','wilcoxon','mannwhitney','sign','kruskal','anova']:
            groups=[a] if method in ['descriptive','shapiro','t_one'] else [a,b,c] if method in ['kruskal','anova'] else [a,b]
            with self.subTest(method=method):
                r=run(method,*groups)
                self.assertTrue(r['formula'])
                self.assertTrue(r['steps'])
                self.assertTrue(r['p'] is None or 0<=r['p']<=1)

    def test_invalid_data_raise_and_do_not_report_false_success(self):
        for method,groups in [('pearson',[[1,1,1],[2,3,4]]),('shapiro',[[1,1,1]]),('t_paired',[[1,2],[1,2]]),('sign',[[0,0],[0,0]]),('descriptive',[[float('nan'),2]])]:
            with self.subTest(method=method),self.assertRaises(ValueError):run(method,*groups)


if __name__=='__main__': unittest.main()
