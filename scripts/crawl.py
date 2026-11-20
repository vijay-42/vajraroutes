"""Download every vajraroutes.com page into a folder.
Usage: python3 scripts/crawl.py .cache/pages  (delete the folder first to re-download)
"""
import re,urllib.request,os,sys,concurrent.futures as cf
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True); B='https://vajraroutes.com'
def get(path):
    fn=os.path.join(OUT,(path.strip('/').replace('/','__').replace('?','_q_').replace('=','-').replace('&','_') or 'home')+'.html')
    if os.path.exists(fn): return open(fn,encoding='utf-8',errors='ignore').read()
    req=urllib.request.Request(B+path,headers={'User-Agent':'Mozilla/5.0'})
    try: s=urllib.request.urlopen(req,timeout=30).read().decode('utf-8','ignore')
    except Exception as e: print('ERR',path,e); return ''
    open(fn,'w').write(s); return s
lists=['/','/packages','/packages?page=2','/packages?page=3','/packages/domestic','/packages/domestic?page=2','/packages/international','/packages/international?page=2','/destinations','/blog','/blog?page=2','/blog?page=3','/about-us','/faq','/contact-us','/gallery','/itinerary-builder','/privacy-policy','/terms-and-conditions','/refund-policy']
pk,de,bl=set(),set(),set()
for p in lists:
    s=get(p)
    pk|=set(re.findall(r'vajraroutes\.com/packages/([a-z0-9-]{12,})',s))
    de|=set(re.findall(r'vajraroutes\.com/destinations/([a-z0-9-]+)',s))
    bl|=set(re.findall(r'vajraroutes\.com/blog/([a-z0-9-]{8,})',s))
sm=urllib.request.urlopen(urllib.request.Request(B+'/sitemap.xml',headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read().decode()
for u in re.findall(r'<loc>([^<]+)</loc>',sm):
    m=re.search(r'/packages/([a-z0-9-]{12,})',u); m and pk.add(m.group(1))
    m=re.search(r'/blog/([a-z0-9-]{8,})',u); m and bl.add(m.group(1))
bl.discard('category')
paths=[f'/packages/{x}' for x in pk]+[f'/destinations/{x}' for x in de]+[f'/blog/{x}' for x in bl]
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(get,paths))
# second pass: destination pages may reveal more packages
for x in de:
    s=get(f'/destinations/{x}'); pk|=set(re.findall(r'vajraroutes\.com/packages/([a-z0-9-]{12,})',s))
pk-= {'domestic','international'}
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(get,[f'/packages/{x}' for x in pk]))
print('packages',len(pk),'destinations',len(de),'blogs',len(bl))
open(os.path.join(OUT,'_slugs.txt'),'w').write('\n'.join(['P '+x for x in sorted(pk)]+['D '+x for x in sorted(de)]+['B '+x for x in sorted(bl)]))
