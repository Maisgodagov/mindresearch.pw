import numpy as np
from scipy import stats


def sphericity(contrasts):
    """Orthonormal contrast covariance; first-order Mauchly chi-square approximation."""
    n,p=contrasts.shape
    covariance=np.atleast_2d(np.cov(contrasts,rowvar=False))
    trace=np.trace(covariance);square=np.trace(covariance@covariance)
    if square<=0:raise ValueError('Нет вариативности контрастов.')
    gg=float(np.clip(trace*trace/(p*square),1/p,1))
    denominator=p*(n-1-p*gg)
    hf=float(np.clip((n*p*gg-2)/denominator,1/p,1)) if denominator>0 else 1.
    if p==1:return dict(gg=1.,hf=1.,w=1.,chi=0.,df=0,p=1.)
    sign,logdet=np.linalg.slogdet(covariance)
    if sign<=0:return dict(gg=gg,hf=hf,w=None,chi=None,df=p*(p+1)/2-1,p=None)
    logw=logdet-p*np.log(trace/p);correction=1-(2*p*p+p+2)/(6*p*(n-1))
    if correction<=0:return dict(gg=gg,hf=hf,w=float(np.exp(logw)),chi=None,df=p*(p+1)/2-1,p=None)
    chi=max(0,float(-(n-1)*correction*logw));df=p*(p+1)/2-1
    return dict(gg=gg,hf=hf,w=float(np.exp(logw)),chi=chi,df=df,p=float(stats.chi2.sf(chi,df)))
