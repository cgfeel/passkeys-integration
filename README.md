# 一个简单的 passkeys 例子

演示结果要实现：账号注册 & 设备绑定、设备登录校验、查看注册的账号及绑定信息

## 安装

```bash
npm install
```

-   在 `node v21.6.1` 下开发，由于服务端需要 `watch`，`node` 版本不能低于 `18`
-   为了便于演示前后端数据交互，全部在 `typescript` 下编写

## 启动

```bash
# 启动后端服务
npm run serve

# 启动前端工程
npm run dev

# 前端编译
npm run build
```

关于服务端：

-   只做演示，所以没做编译
-   启动后交互数据即时存在内存中，会随每次销毁清空
-   由于是 `watch` 模式，所以每次修改操作也会自动清空存储的数据

关于前端：

-   支持开发模式（跨域 `dev`）和生产（同域 `build`）两个模式

> 备注：网站域名和端口都属于 `passkeys` 认证时必备信息，必须和配置对应，可以支持多个域名和端口。

## 环境依赖概要（只说重点）

服务端：

-   `@simplewebauthn/server`：`webauthn` 的服务端支持库
-   `express`：服务端运行环境
-   `ts-node`：支持服务端的 `typescript`

前端:

-   `@simplewebauthn/browser`：`webauthn` 的前端支持库
-   `rsbuild`：构建工具
-   `React`：前端库

## 服务接口

授权认证的 4 个接口：

-   `/register/start`：下发设备绑定的 `options` 给前端
-   `/register/finish`：接受设备绑定，验证成功后提交上来的 `response`
-   `/login/start`：下发设备登录的 `options` 给前端
-   `/login/finish`：接受设备登录，验证成功后提交上来的 `response`

> 以上接口全部为 `post` 方法，接收的数据见 `server/index.ts`

查询 & 前端同域：

-   `/passkeys`：查询已绑定的设备列表
-   `/`：同域访问编译后的前端项目

## 接口中使用的方法

注册 & 设备绑定：

-   `@simplewebauthn/server.generateRegistrationOptions`：服务端生成绑定设备的 `options`
-   `@simplewebauthn/browser.startRegistration`：前端将 `options` 交给浏览器绑定设备后，将 `response` 提交给服务端
-   `@simplewebauthn/server.verifyRegistrationResponse`：服务端将拿到的 `response` 验证后，将结果返回给前端

设备登录：

-   `@simplewebauthn/server.generateAuthenticationOptions`：服务端生成设备登录的 `options`
-   `@simplewebauthn/browser.startAuthentication`：前端将 `options` 交给浏览器设备登录后，将 `response` 提交给服务端
-   `@simplewebauthn/server.generateAuthenticationOptions`：服务端将拿到的 `response` 验证后，将结果返回给前端

除此之外为了跑通流程，模拟了数据存储和交互的方法

-   `server/pseudocode.ts`：建议从 `typescript` 类型去了解交互过程，实际开发需要根据业务做调整

## 参考资料

`simplewebauthn`：

-   `@simplewebauthn/server`：https://simplewebauthn.dev/docs/packages/server
-   `@simplewebauthn/browser`：https://simplewebauthn.dev/docs/packages/browser

其他资料：

-   `mdn`：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Authentication_API
-   `passkeys`：https://www.passkeys.com/guide
-   `safe`：https://docs.safe.global/advanced/passkeys/tutorials/react
-   `@teamhanko/passkeys-sdk`：https://www.hanko.io/blog/passkeys-react
-   廖雪峰解读 `passkeys` 配置：https://liaoxuefeng.com/blogs/all/2023-08-16-passkey-dev/index.html

`webauthn` 开发库：

-   `simplewebauthn`：https://github.com/MasterKale/SimpleWebAuthn
-   `@ownid/webauthn`：https://www.npmjs.com/package/@ownid/webauthn
-   `@teamhanko/passkeys-sdk`：https://github.com/teamhanko/passkeys

选择 `simplewebauthn` 的原因：

-   纯 JS 运行环境、目前依旧在维护
-   `NextAuth` 对于 `passkeys` 的方案也是 `simplewebauthn`：https://www.authjs.cn/getting-started/authentication/webauthn
