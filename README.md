# 自定义日历组件 Custom Calendar

这是一个使用 Web Components API 实现的自定义日历组件


## 安装和使用

1. 将日历组件添加到您的项目中。

```html
<!-- 在 HTML 文件中引入日历组件 -->
<script src="src/index.js"></script>
```
其中需要说明的是，引入顺序会对代码功能有一定的影响，这是无法避免的：

 - 在父页面DOM元素前引入，无法监听初始化日期时的init事件
 - 在父页面DOM元素后引入，修改元素属性时无法监听oldValue
 

2. 在HTML 文件中使用自定义元素 <a-calendar>。
```html
<!-- 在您的 HTML 文件中使用 <a-calendar> 元素 -->
    <a-calendar id="cal" config="123">
        <!-- 使用 Shadow DOM 封装插槽内容，并在插槽内容内定义样式 -->
        <div slot="customBox">
            <style>
                /* 在插槽内容内定义样式 */
                .custom-box-content {
                    color: red;
                    font-size: 18px;
                }
            </style>
            <!-- 插入到插槽的内容 -->
            <div class="custom-box-content">这是插入到 customBox 插槽中的内容</div>
        </div>
    </a-calendar>
```
3. 在 JavaScript 文件中监听日历组件的自定义事件。
```js


const calendar = document.querySelector('a-calendar');

//属性修改，内部会进行监听
calendar.setAttribute('config', '233');

// 监听日期变化事件
calendar.addEventListener('dayClick', (event) => {
  console.log('选中的日期:', event.detail);
});

// 监听初始化时的日期事件
calendar.addEventListener('init', (event) => {
  console.log('当前年份:', event.detail.year);
  console.log('当前月份:', event.detail.month);
});
// 监听年月变化事件
calendar.addEventListener('change', (event) => {
  console.log('当前年份:', event.detail.year);
  console.log('当前月份:', event.detail.month);
});

```


## 功能特性
- 支持选择日期。
- 灵活定制样式。
示例
您可以在 [示例页面](./src/test.html) 中查看日历组件的演示。

## 贡献
欢迎为该项目作出贡献！如果您发现问题或者有改进的建议，请提交 issue 或者 pull 请求。


