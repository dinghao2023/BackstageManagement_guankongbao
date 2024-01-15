import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'// 获取token|设置token|删除token的函数
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router';
import router from '@/router';
import cloneDeep from 'lodash/cloneDeep'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],//当前用户可以展示的路由信息
    roles: [],//当前用户所扮演的角色
    buttons: [],//按钮权限的信息（一个数组，显示当前用户可以使用哪些按钮权限）
    resultAsyncRoutes: [],//当前用户需要展示的全部异步路由
    resultAllRoutes: []//当前用户最终需要展示全部路由
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {//重置state
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {//存储用户信息
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes;//当前用户需要展示的全部异步路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes); //当前用户最终需要展示全部路由，包含计算出的全部异步路由，以及constantRoutes和anyRoutes
    router.addRoutes(state.resultAllRoutes)//给路由器添加路由
  }
}

const actions = {
  async login({ commit }, userInfo) {//用户点击登录后派发此action
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if(result.code==20000){
      commit('SET_TOKEN',result.data.token);
      setToken(result.data.token);//本地持久化存储token
      return 'ok';
    }else{
      return Promise.reject(new Error('faile'));
    }
  },
  getInfo({ commit, state }) {//获取用户信息
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {//返回数据包含：用户名name、头像avatar、routes（一个数组，显示当前用户可以展示哪些菜单权限）、roles（当前用户所扮演的角色）、buttons（一个数组，显示当前用户可以使用哪些按钮权限）
        const { data } = response;
        commit('SET_USERINFO',data);
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes));
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

//该函数用于计算出当前用户需要展示的全部异步路由。asyncRoutes为从router文件中获取的所有异步路由，routes为服务器返回的当前用户可以展示的路由信息
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length) {//注意不要忽略了2、3、4、5、6级路由
        item.children = computedAsyncRoutes(item.children, routes);//递归
      }
      return true;
    }
  })
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

