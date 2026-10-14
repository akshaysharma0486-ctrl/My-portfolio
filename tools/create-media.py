"""Original procedural motion study and ambient score for Akshay's portfolio."""
from pathlib import Path
import numpy as np
import imageio.v2 as imageio
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter
import math, wave, subprocess
root=Path(__file__).resolve().parents[1]/'dist/assets'
W,H=960,540; FPS=24; frames=192
writer=imageio.get_writer(str(root/'brand-motion.mp4'),fps=FPS,codec='libx264',quality=7,macro_block_size=1,ffmpeg_params=['-pix_fmt','yuv420p','-movflags','+faststart'])
u=np.linspace(0,2*np.pi,220);v=np.linspace(0,2*np.pi,64)
U,V=np.meshgrid(u,v,indexing='ij')
for f in range(frames):
 phase=2*np.pi*f/frames
 R=1.8+.22*np.sin(U*3+phase);r=.48+.10*np.cos(U*2-phase)
 X=(R+r*np.cos(V))*np.cos(U);Y=(R+r*np.cos(V))*np.sin(U);Z=r*np.sin(V)+.5*np.sin(U*2+phase)
 # Slow sculpture rotation, a full seamless cycle.
 a=.5+phase; X2=X*np.cos(a)+Z*np.sin(a);Z2=-X*np.sin(a)+Z*np.cos(a)
 b=.75+.12*np.sin(phase);Y2=Y*np.cos(b)-Z2*np.sin(b);Z3=Y*np.sin(b)+Z2*np.cos(b)
 perspective=5/(5+Z3);px=W*.59+X2*perspective*115;py=H*.53+Y2*perspective*115
 im=Image.new('RGB',(W,H),(9,9,9));draw=ImageDraw.Draw(im)
 faces=[]
 P=np.stack([X2,Y2,Z3],axis=-1)
 normals=np.cross(P[1:,:-1]-P[:-1,:-1],P[:-1,1:]-P[:-1,:-1]);normals/=np.maximum(np.linalg.norm(normals,axis=-1,keepdims=True),1e-8)
 diffuse=np.maximum(0,normals@np.array([-.3,-.5,-.8]));spec=np.maximum(0,normals@np.array([-.2,-.25,-.947]))**22
 shades=np.minimum(160,12+diffuse*34+spec*115).astype(int)
 for j in range(len(u)-1):
  for k in range(len(v)-1):
   points=[(px[j,k],py[j,k]),(px[j+1,k],py[j+1,k]),(px[j+1,k+1],py[j+1,k+1]),(px[j,k+1],py[j,k+1])]
   shade=int(shades[j,k]);warm=max(0,math.sin(u[j]*2-phase))**12
   color=(min(210,shade+int(warm*17)),shade, max(8,shade-int(warm*5)))
   faces.append((float(Z3[j:j+2,k:k+2].mean()),points,color))
 for _,points,color in sorted(faces,reverse=True,key=lambda x:x[0]):draw.polygon(points,fill=color)
 im=im.filter(ImageFilter.GaussianBlur(.8))
 if f==0:im.save(root/'brand-motion-poster.jpg',quality=90)
 writer.append_data(np.asarray(im))
writer.close();print('Created seamless abstract film.')
# 24-second, 80 BPM original ambient loop. No third-party audio samples.
sr=32000;duration=24;n=sr*duration; t=np.arange(n)/sr; track=np.zeros((n,2),dtype=np.float64)
rng=np.random.default_rng(2017)
def freq(midi):return 440*2**((midi-69)/12)
def add(note,start,length,volume,kind='pad',pan=0):
 count=int(length*sr); tt=np.arange(count)/sr;hz=freq(note)
 if kind=='pad':
  envelope=np.sin(np.pi*np.minimum(tt/length,1))**1.6
  sound=(np.sin(2*np.pi*hz*tt)+.22*np.sin(2*np.pi*hz*2.001*tt)+.13*np.sin(2*np.pi*hz*.998*tt))*envelope
 else:
  envelope=(1-np.exp(-tt*50))*np.exp(-tt*2.5)
  sound=(np.sin(2*np.pi*hz*tt)+.25*np.sin(2*np.pi*hz*2*tt))*envelope
 idx=(np.arange(count)+int(start*sr))%n
 for channel,gain in enumerate([math.sqrt((1-pan)/2),math.sqrt((1+pan)/2)]):np.add.at(track[:,channel],idx,sound*volume*gain)
chords=[[45,52,57,60,64],[41,48,53,57,60],[48,55,60,64,67],[43,50,55,59,62]]
for bar,chord in enumerate(chords):
 for k,note in enumerate(chord):add(note,bar*6-.75,7.5,.042,'pad',(k-2)*.3)
 add(chord[0]-12,bar*6,6,.055,'pad',0)
 for step in range(8):add(chord[2+step%3]+12,bar*6+step*.75,2.8,.021,'bell',math.sin(step)*.6)
# A soft pulse, restrained enough to leave space for the visuals.
for beat in range(32):
 start=int(beat*.75*sr);tt=np.arange(int(.22*sr))/sr
 pulse=np.sin(2*np.pi*(49*tt+1.3*(1-np.exp(-tt*22))))*np.exp(-tt*22)*.025
 ix=(np.arange(len(tt))+start)%n;track[ix,0]+=pulse;track[ix,1]+=pulse
track=np.tanh(track*1.25);track*=.65/max(.65,float(np.max(np.abs(track))))
# Cross-seam echo uses circular shifts so the loop has no discontinuity.
track+=.12*np.roll(track,int(sr*.375),axis=0)[:,::-1]
wav=root/'ambient-original.wav'
with wave.open(str(wav),'wb') as out:
 out.setnchannels(2);out.setsampwidth(2);out.setframerate(sr);out.writeframes((np.clip(track,-1,1)*32767).astype('<i2').tobytes())
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error','-i',str(wav),'-c:a','aac','-b:a','128k',str(root/'ambient-original.m4a')],check=True)
wav.unlink();print('Created original ambient score.')
