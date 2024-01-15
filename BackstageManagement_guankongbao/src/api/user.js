import request from '@/utils/request'

export function login(data) {//用户点击登录时发送此请求，完整请求路径：http://localhost:9528/dev-api/admin/acl/index/login
    return request({
        url: '/admin/acl/index/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/admin/acl/index/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/admin/acl/index/logout',
        method: 'post'
    })
}