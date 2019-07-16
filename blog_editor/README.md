前面部分是关于React教程 [Create React App](https://github.com/facebook/create-react-app)里面的一些帮助说明，后面部分是我的记录

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## 可见即可得的markdown编辑器

为了方便的添加修改我的博客，在管理页面下我需要一个编辑器，这个编辑器应该要满足以下几点:

- 真正的可见即可得（不是实时预览）
- 使用markdown语法
- 最好有一定的离线保存能力

一番搜索后，找到一个开源的富文本编辑器比较符合我的要求，附上链接https://github.com/wangfupeng1988/wangEditor/

这个编辑器已经可以满足我的第一点需求，它的富文本解析不是用markdown的，我需要稍作修改，首先我们对这个库的工程结构做个了解:

- 是一个 node 工程
- 使用 gulp 作为任务管理器
- 代码符合某种包管理规范

有了这些信息，我们就可以先将工程编译测试一下，

### 在开始之前

在一段时间的折腾后，我发现了一些现象...

- 实现一个小功能，有可能因为它本身的依赖导致需要推翻你前面的所有设计

  比如说我要用slate来实现一个富文本编辑器，它对我做了什么捆绑

  - 它的渲染使用的是React（React是用来做单页app的），我没法很好的直接在现有的框架直接集成它
  - React使用JavaScript，现有框架使用python，这面临着语言级别的切换

  这些捆绑花费了我大量的精力，而我的本意却是实现一个简单的编辑器

- 前端开发者不应该需要了解到一些细节（比如程序打包）

  有些框架其实没有搞清楚自己的角色，它们应该要对开发者尽量的透明，开发者只要知道你是做什么的，然后按照直觉遵循一般使用这个部件的规则去使用你的框架就可以了

### gulp

gulp 是我第一个接触的框架，它本身比较容易理解，就是管理编辑任务的，我们只需在工程底下新建一个 gulpfile.js，然后执行 gulp 就可以开始任务了

[官方文档](https://gulpjs.com/docs/en/api/task)

一般会配置一个叫default的任务，监听所有关心的文件变化，并在文件变化时执行编译工作

```javascript
// 默认任务配置
gulp.task('default', () => {
    gulp.task('copy-fonts', series(copyFontTask,cssTask, scriptTask))
    // 监听 js 原始文件的变化
    gulp.watch('./src/js/**/*.js', scriptTask)
    // 监听 css 原始文件的变化
    gulp.watch('./src/less/**/*.less', series(cssTask, scriptTask))
    // 监听 icon.less 的变化，变化时重新拷贝 fonts 文件
    gulp.watch('./src/less/icon.less', copyFontTask)
})
```

- copyFontTask、cssTask等是自己定义的任务

- 如果需要注册多个任务，用上 series

- 使用命令行执行任务

  ```powershell
  gulp <任务名>
  ```

### slate

[官方链接](https://docs.slatejs.org/general/resources)

slate是一个有使命感的开源库，作者对于网上几种富文本编辑器进行了深入研究之后，给出了自己对富文本编辑器的答案

#### 为什么要造个轮子（README中的Why)

现有的开源库存在一些问题

- 编辑器的模板无法或者很难修改，很多富文本编辑器都没有把抽象的颗粒度把握好，以致于一些简单的自定义（比如说comments等）都无法完成
- 从开发者的角度，想要使用代码去修改 documents 非常困难
- 导出成其他格式（markdown、HTML等）很多时候是一种事后设计，由于不是一个原生支持的功能，实现上十分繁琐
- 很多编辑器自己造轮子渲染界面，而不是使用成熟的方案（比如React）
- 没有预先为`协同编辑`保留空间，编辑器底层的数据结构不适合`协同编辑`
- 仓库本身很庞大（monolithic）而无法分割（耦合性太强）
- 无法或者很难编辑复杂的 documents（比如tables、embeds）

#### Principles

slate对上述问题给出的答案是:

- 插件优先，甚至一些编辑器的核心行为都是以插件的形式存在的
- 无scheme的内核，slate 不会假设你使用某种scheme，也就是说你的数据可以在不同的场景实际上是可以直接迁移的
- 嵌套的文档树（documents），slate 本身的 documents 和 原生的 DOM 一样，是一个递归嵌套树
- 和DOM平等，你对DOM的所有行为，大部分也可以用在slate的documents
- 无状态（stateless）的视图以及不可变（immutable）的数据
- 按照直觉的方式编辑documents（intuitive changes）
- 为协同编辑设计的数据结构
- 消除核心与插件的边界，模糊核心与插件之间的差别

#### Data Model

Slate的数据结构是对DOM的映射，因此DOM中的概念在Slate几乎可以没有转换直接使用

##### Range

- Html文档中的随意一段内容
- 有起点（anchor）和终点（offset）
  - 两者可以是同一个点
  - `anchor`可能在`offset`的后面（取决于鼠标选择的方向）
  - 为了方便，`slate`提供一个保证方向顺序的属性`start`和`end`
  - 可以自己创建一段`Range`

##### Selection

- 代表当前选中的Range
- 标准的`DOM`里面`Selection`可以包含多个元素

##### Point

- 借鉴与`Range`，表示一个点



为了方便处理文本和减少迷惑，`slate`对部分`DOM`标准进行了限制

- `Document`必须含有`Block`节点作为直接子节点

  这点反映了富文本编辑器的工作方式，最顶层的元素在按`Enter`键时可以拆分

- `Block`节点可以包含其他`Block`节点，也可以包含`inline`和`text`节点

- `inline`节点只能包含`inline`节点或`text`节点

- 两个`text`节点靠近一起会自动合并成一个

- `Block`和`inline`节点至少要包含一个`text`节点

  `slate`会假设这一点，并且在访问文本相关属性时自动进入这个`Block`或者`inline`

## React

[官方链接](https://reactjs.org/docs/create-a-new-react-app.html)

slate使用React作为渲染框架，这直接限定了我们选择其他部件的可能。

- React 不能很好的仅嵌入一个script标签到web中（如果只是只是想想练习一下React，[有方法可以做到](https://reactjs.org/docs/add-react-to-a-website.html)）
- React 的几种工具链几乎都是针对单页App的，需要绑定很多环境

基于这些原因，几乎不可能在现有的工程里面灵活的集成slate，可能另外新建React工程是一个更好的选择

React根据不同的用途提供了几种可选工具链:

- 使用npx直接构造一个单页app
- 构建使用Nodejs的服务器端渲染网站 —— Next.js
- 构建一个静态内容网站 —— Gatsby.js
- 其余更多灵活配置的工具链

#### JSX

JSX的出现是为了解决html开发过程中处理ui和逻辑的代码过度零散的问题，解决的方法是将所有ui操作和逻辑都放到同一个`component`里面

JSX很像是一个javascript版本的模板语言，因此我们也会以同样的角度去看待JSX

- 可以访问外部的js命名空间
- 模板语法本身也是一个表达式
- 潜在的注入攻击保护

#### 组件（Component）

Component可以简单的认为是一个js函数，传入属性（props），它返回你应该怎么渲染这个组件

- 组件名首字母大写
- 保证props是一个纯函数（只读）

#### props和state

`state`和`props`很像，只是State是完全由组件控制的（`props`对于组件来说是只读的），对于`state`的用法有几点说明:

- 除了在构造函数以外，都使用`setState`方法设置

- `state`和`props`不是同步更新的，不能假设`state`更新后，`props`就可以拿到最新的值

  ```javascript
  this.setState((state, props) => ({
    counter: state.counter + props.increment
  }));
  ```

- `state`对于使用浅合并的方式合并对象（可以理解为增量更新）

#### 自上而下的数据流

对于一个`component`而言，无论是它的父组件还是子组件都不应该关心它是否有状态（stateful）或者无状态（stateless）

举个例子，子组件在收到外部传来的属性时，根本不知道是父组件的props还是state还是手动输入的值

这种单向数据流的好处是组件的使用变得相当的灵活，由于没有上下文的约束，有状态和无状态的组件可以任意组合

#### 向上传递State

有些时候，我们不可避免的需要关心组件之间的状态，这个时候要有方法可以修改组件内部的状态，React把这种场景成为 Lifting State Up，意思是组件向外部暴露方法设置其内部属性

#### 组合与继承

在使用继承方式编写代码之后，都会寻求一定程度的组合，React鼓励以组合的思维方式编写组件

##### children

```react
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
// WelcomeDialog 把自己的ui嵌入了 FancyBorder 
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

上面的组件使用`props.children`预留了子组件的位置，组件的使用者（WelcomeDialog）可以方便把自己的组件嵌套在其中

如果想要更多的插槽，React允许你自定义插槽

```react
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

#### Lifecycle

- mount 和 unmount

  这个概念是组件挂载和弹出Html节点的生命周期

- 组件中有一些声明周期方法，componentDidMount（挂载）算是一个

#### 开箱即用

创建一个React模板工程十分轻松，

```shell
npx create-react-app my-app
cd my-app
npm start
```

- npx是高版本的npm支持的工具
- npm start 自动帮我们启动一个本地的测试环境

一切就绪后，默认浏览器会打开localhost:3000，这意味着我们的第一个React工程已经创建好了

#### 发布

```
npm run build
```

React会帮你编译一个发布版本，从结果看来，它帮你进行了代码压缩，优化等操作，最终拷贝到public目录下

要看到发布后的效果，我们还需要自己启动一个backend，官方推荐使用serve

```shell
npm install serve -g
serve -s build
```

#### 发送Http请求

在React想发送http请求有三种选择:

- 使用原生的Web Api - Fetch

  服务器原生支持，兼容性并不那么好

- 使用axios

  最佳选择

- 使用Jquery

  不鼓励为了简单的请求数据就集成那么大一个库

- 使用原生的XMLHttpRequestq



## Gatsby.js

[官方链接](https://www.gatsbyjs.org/docs/)

Gatsby.js是对静态网站方向的React脚手架，开箱即用

然而集成度太高反而限制了我的手脚，我只需一个简单的界面，不需要太多已经定制好的“漂亮样式”



## Next.js

Next.js貌似是一个更好的选择，然而还没开始用就让我注册这一点马上把我逼退了