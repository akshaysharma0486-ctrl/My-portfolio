"""Original seamless satin-ribbon motion study, distinct from the hero sculpture."""
from pathlib import Path
import numpy as np
import imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFilter
root=Path(__file__).resolve().parents[1]/'dist/assets'
w,h=960,540;fps=24;frames=192
writer=imageio.get_writer(str(root/'design-rule-ribbons.mp4'),fps=fps,codec='libx264',quality=7,macro_block_size=1,ffmpeg_params=['-pix_fmt','yuv420p','-movflags','+faststart'])
x=np.linspace(-100,w+100,320)
for f in range(frames):
 phase=2*np.pi*f/frames
 im=Image.new('RGB',(w,h),(11,11,11));d=ImageDraw.Draw(im)
 for band in range(7):
  seed=band*.82
  center=h*.5+(band-3)*62+42*np.sin(x/185+phase+seed)+28*np.sin(x/340-phase*2+seed)
  thickness=16+18*(.5+.5*np.sin(x/230-phase+seed))
  for stripe in range(28):
   z=stripe/27
   upper=center+(z-.5)*thickness
   lower=center+(z+1/27-.5)*thickness
   lighting=(np.sin(z*np.pi)**10)*(.65+.35*np.sin(phase+seed))
   shade=int(14+lighting*85)
   warm=band in (1,5)
   color=(min(160,shade+int(lighting*42)) if warm else shade, max(12,shade-int(lighting*20)) if warm else shade, max(11,shade-int(lighting*29)) if warm else max(11,shade-5))
   points=list(zip(x,upper))+list(zip(x[::-1],lower[::-1]))
   d.polygon(points,fill=color)
 im=im.filter(ImageFilter.GaussianBlur(.75))
 if f==0:im.save(root/'design-rule-ribbons-poster.jpg',quality=90)
 writer.append_data(np.asarray(im))
writer.close()
print('Created 8-second seamless flowing-ribbon film.')
