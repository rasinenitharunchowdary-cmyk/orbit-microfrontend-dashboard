import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'');return {plugins:[react(),federation({name:'shell',remotes:{
  auth:{type:'module',name:'auth',entry:env.VITE_AUTH_REMOTE||'http://localhost:4174/remoteEntry.js'},
  dashboard:{type:'module',name:'dashboard',entry:env.VITE_DASHBOARD_REMOTE||'http://localhost:4175/remoteEntry.js'},
  users:{type:'module',name:'users',entry:env.VITE_USERS_REMOTE||'http://localhost:4176/remoteEntry.js'},
  analytics:{type:'module',name:'analytics',entry:env.VITE_ANALYTICS_REMOTE||'http://localhost:4177/remoteEntry.js'},
  notifications:{type:'module',name:'notifications',entry:env.VITE_NOTIFICATIONS_REMOTE||'http://localhost:4178/remoteEntry.js'}
},shared:{react:{singleton:true,requiredVersion:'^19.3.0'},'react-dom':{singleton:true,requiredVersion:'^19.3.0'},'react-router-dom':{singleton:true},zustand:{singleton:true},'@mfe/platform':{singleton:true},'@mfe/ui':{singleton:true}}})],server:{port:4173},preview:{port:4173},build:{target:'chrome89',sourcemap:true}}});
