const ToolBase = require('../core/toolBase');

class AIPromptTool extends ToolBase {
  constructor() {
    super(
      'ai-prompt',
      'AI提示工具，用于生成Element Plus组件和优化API',
      [
        {
          name: 'action',
          type: 'string',
          required: true,
          description: '要执行的操作：generate-component（生成组件）或 optimize-api（优化API）'
        },
        {
          name: 'componentType',
          type: 'string',
          required: false,
          description: '要生成的Element Plus组件类型'
        },
        {
          name: 'config',
          type: 'string',
          required: false,
          description: '组件生成的配置'
        },
        {
          name: 'code',
          type: 'string',
          required: false,
          description: '要优化的API代码'
        }
      ]
    );
  }

  async execute(params) {
    const { action, componentType, config, code } = params;

    switch (action) {
      case 'generate-component':
        return this.generateComponent(componentType, config);
      case 'optimize-api':
        return this.optimizeApi(code);
      default:
        throw new Error(`未知操作：${action}`);
    }
  }

  generateComponent(componentType, config) {
    if (!componentType) {
      throw new Error('生成组件需要指定组件类型');
    }

    let componentCode = '';
    let explanation = '';

    // 分析用户配置，提取组件属性
    const parseConfig = (config) => {
      if (!config) return {};
      try {
        return JSON.parse(config);
      } catch (e) {
        // 如果不是JSON，尝试提取关键词
        const props = {};
        if (config.includes('主要') || config.includes('primary')) props.type = 'primary';
        if (config.includes('禁用') || config.includes('disabled')) props.disabled = true;
        if (config.includes('加载') || config.includes('loading')) props.loading = true;
        if (config.includes('圆角') || config.includes('round')) props.round = true;
        if (config.includes('圆形') || config.includes('circle')) props.circle = true;
        return props;
      }
    };

    const props = parseConfig(config);

    // 生成属性字符串
    const generateProps = (propObj) => {
      return Object.entries(propObj)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `:${key}="'${value}'"`;
          }
          return `:${key}="${value}"`;
        })
        .join(' ');
    };

    // 检查是否指定了组件库前缀
    if (componentType.startsWith('wp-')) {
      // Web Plus 组件
      const baseType = componentType.substring(3);
      switch (baseType) {
        case 'button':
          // 按钮组件支持的属性
          const buttonProps = { 
            ...props, 
            type: props.type || 'primary',
            size: props.size || 'default',
            icon: props.icon || '',
            'icon-config': props['icon-config'] || '{}',
            loading: props.loading || false,
            disabled: props.disabled || false,
            round: props.round || false,
            circle: props.circle || false,
            link: props.link || false,
            plain: props.plain || false,
            'auto-insert-space': props['auto-insert-space'] !== undefined ? props['auto-insert-space'] : true
          };
          
          // 生成按钮组件代码
          componentCode = `<LSButton ${generateProps(buttonProps)} @click="handleButtonClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
  ${props.icon ? `<template #icon>
    <LSIcon :type="1" name="${props.icon}" color="${props.iconColor || '#fff'}" width="18" height="18" />
  </template>` : ''}
  ${buttonProps.circle ? '' : (props.text || '主要按钮')}
</LSButton>

<!-- 按钮组示例 -->
<LSButtonGroup separator="|" :separator-size="14">
  <LSButton type="primary">按钮1</LSButton>
  <LSButton type="success">按钮2</LSButton>
  <LSButton type="warning">按钮3</LSButton>
</LSButtonGroup>`;
          
          explanation = `生成了@lingshugroup/web-plus按钮组件，支持类型、尺寸、图标、状态等多种配置，以及按钮组功能`;
          break;
        case 'input':
          const inputProps = Object.assign({}, props, { placeholder: props.placeholder || '请输入内容' });
          componentCode = `<el-input v-model="inputValue" ${generateProps(inputProps)}></el-input>`;
          explanation = `生成了Element Plus输入组件（与@lingshugroup/web-plus配合使用），属性：${Object.keys(inputProps).join(', ')}`;
          break;
        case 'table':
          // 表格组件支持的属性
          const tableProps = { 
            ...props, 
            'table-column': props['table-column'] || 'tableColumn', 
            'table-data': props['table-data'] || 'tableData',
            loading: props.loading || false,
            'show-pagination': props['show-pagination'] !== undefined ? props['show-pagination'] : true,
            'pagination-class': props['pagination-class'] || '',
            total: props.total || 0,
            'current-page': props['current-page'] || 1,
            'page-size': props['page-size'] || 10,
            'page-sizes': props['page-sizes'] || '[10, 20, 30, 40, 50, 100]',
            'pagination-options': props['pagination-options'] || '{}',
            'show-table-index': props['show-table-index'] !== undefined ? props['show-table-index'] : true,
            'table-index-fixed': props['table-index-fixed'] || false,
            'table-index-label': props['table-index-label'] || '序号',
            'index-column-options': props['index-column-options'] || '{}',
            'show-radio': props['show-radio'] || false,
            'radio-column-options': props['radio-column-options'] || '{}',
            'show-radio-label': props['show-radio-label'] || false,
            'radio-prop': props['radio-prop'] || 'id',
            'current-row': props['current-row'] || '',
            'show-select': props['show-select'] || false,
            'select-column-options': props['select-column-options'] || '{}',
            'selection': props['selection'] || '[]',
            'show-expand': props['show-expand'] || false,
            'expand-column-options': props['expand-column-options'] || '{}',
            'show-empty': props['show-empty'] !== undefined ? props['show-empty'] : true,
            'label-empty': props['label-empty'] || '--',
            'label-empty-class': props['label-empty-class'] || '',
            'empty-label': props['empty-label'] || '暂无数据',
            'table-index-in-page': props['table-index-in-page'] || false,
            'table-index-start': props['table-index-start'] || false
          };
          
          // 生成表格组件代码，包含常用插槽
          componentCode = `<LSTable ${generateProps(tableProps)} @size-change="handleSizeChange" @current-page-change="handleCurrentPageChange">
  <template #empty>
    <div class="ls-table-empty">
      <LSIcon name="DocumentRemove" size="48" color="#ccc" />
      <div style="margin-top: 16px;">{{ tableProps['empty-label'] }}</div>
    </div>
  </template>
  <template #append>
    <div class="ls-table-append">
      <!-- 表格底部自定义内容 -->
    </div>
  </template>
  <template #default>
    <!-- 后置自定义内容 -->
  </template>
  <template #prepend>
    <!-- 前置自定义内容 -->
  </template>
  <!-- 列插槽示例 -->
  <template #status="{ row }">
    <el-tag :type="row.status">{{ row.status }}</el-tag>
  </template>
  <template #status-header="{ column }">
    <div>
      <LSIcon name="CollectionTag" color="#409EFF" size="20" />
      {{ column.label }}
    </div>
  </template>
</LSTable>`;
          
          explanation = `生成了@lingshugroup/web-plus表格组件，支持分页、选择、索引、空状态等多种功能，包含完整的属性和插槽`;
          break;
        case 'form':
          // 表单组件支持的属性
          const formProps = { 
            ...props, 
            'form-data': props['form-data'] || 'formData',
            'form-items': props['form-items'] || 'formItems',
            column: props.column || 1,
            loading: props.loading || false,
            'show-btn-loading': props['show-btn-loading'] !== undefined ? props['show-btn-loading'] : true,
            read: props.read || false,
            disabled: props.disabled || false,
            'show-buttons': props['show-buttons'] !== undefined ? props['show-buttons'] : true,
            'buttons-class': props['buttons-class'] || '',
            'buttons-left': props['buttons-left'] || false,
            'show-reset': props['show-reset'] !== undefined ? props['show-reset'] : true,
            'show-submit': props['show-submit'] !== undefined ? props['show-submit'] : true,
            'confirm-text': props['confirm-text'] || '确认',
            'reset-text': props['reset-text'] || '重置',
            'confirm-class-name': props['confirm-class-name'] || '',
            colon: props.colon !== undefined ? props.colon : true,
            'label-empty': props['label-empty'] || '--',
            'has-def-read-style': props['has-def-read-style'] || false
          };
          
          // 生成表单组件代码，包含常用插槽
          componentCode = `<LSForm ${generateProps(formProps)} @submit="handleFormSubmit" @reset="handleFormReset" @on-change="handleFormChange" @change-form-data="handleFormDataChange">
  <template #buttons-prepend>
    <div class="form-buttons-prepend">
      <!-- 按钮前置自定义内容 -->
    </div>
  </template>
  <template #buttons-append>
    <div class="form-buttons-append">
      <!-- 按钮后置自定义内容 -->
    </div>
  </template>
  <template #default>
    <!-- 后置自定义内容 -->
  </template>
  <!-- 表单项插槽示例 -->
  <template #name>
    <LSFormItem label="自定义名称">
      <el-input v-model="formData.name"></el-input>
    </LSFormItem>
  </template>
  <template #name-prepend>
    <!-- 名称前置内容 -->
  </template>
  <template #name-append>
    <!-- 名称后置内容 -->
  </template>
  <template #name-slot>
    <!-- 自定义表单项内容 -->
  </template>
  <template #name-read-slot>
    <!-- 只读模式下的自定义内容 -->
  </template>
</LSForm>

<!-- 表单项组件示例 -->
<LSFormItem type="input" label="用户名" prop="username" v-model="formData.username" :rules="{ required: true, message: '请输入用户名', trigger: 'blur' }"></LSFormItem>
<LSFormItem type="select" label="类型" prop="type" v-model="formData.type" :options="[{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }]"></LSFormItem>
<LSFormItem type="date" label="日期" prop="date" v-model="formData.date"></LSFormItem>`;
          
          explanation = `生成了@lingshugroup/web-plus表单组件，支持多种输入类型、验证规则、插槽等功能，包含完整的属性和插槽`;
          break;
        case 'upload':
          // 处理 item 属性，支持 UploadItemType 格式
          let uploadProps = { ...props };
          if (props.item) {
            // 如果提供了 item 属性，使用它
            uploadProps.item = props.item;
          } else {
            // 否则创建默认的 item 对象
            uploadProps.item = {
              isCover: props.isCover !== undefined ? props.isCover : true,
              limitFile: props.limitFile || [],
              limitFileMsg: props.limitFileMsg || '',
              limitSize: props.limitSize || 2,
              limitUnit: props.limitUnit || 'MB',
              limitSizeMsg: props.limitSizeMsg || '',
              limitNumMsg: props.limitNumMsg || '',
              limitAllFail: props.limitAllFail !== undefined ? props.limitAllFail : false,
              httpRequestFunc: props.httpRequestFunc || '',
              formRuleFunc: props.formRuleFunc || '',
              formValidateFunc: props.formValidateFunc || '',
              isToast: props.isToast !== undefined ? props.isToast : true,
              emptyFileMsg: props.emptyFileMsg || '',
              profile: props.profile !== undefined ? props.profile : false,
              defProfile: props.defProfile || '',
              hideCoverBtn: props.hideCoverBtn !== undefined ? props.hideCoverBtn : false,
              tipContent: props.tipContent || '',
              hideBtnReachLimit: props.hideBtnReachLimit !== undefined ? props.hideBtnReachLimit : false,
              bgImage: props.bgImage || '',
              beforeUpload: props.beforeUpload || '',
              onRemove: props.onRemove || ''
            };
          }
          
          // 生成组件代码，包含常用事件和插槽
          componentCode = `<LSUpload ${generateProps(uploadProps)} @upload-error-func="handleUploadError" @http-response-func="handleHttpResponse" @on-change-func="handleFileChange" @on-handle-cropper="handleImageCropper" @success="handleUploadSuccess" @error="handleUploadError" @remove="handleFileRemove">
  <template #trigger>
    <LSButton type="primary">上传文件</LSButton>
  </template>
  <template #tip>
    <div class="ls-tip">
      ${uploadProps.item.tipContent || '请上传文件'}
    </div>
  </template>
  <template #file="{ file }">
    <div class="custom-file-item">
      <span>{{ file.name }}</span>
      <LSButton size="small" type="danger" @click.stop="handleCustomRemove(file)">
        删除
      </LSButton>
    </div>
  </template>
</LSUpload>`;
          
          explanation = `生成了@lingshugroup/web-plus上传组件，支持文件格式、大小限制，以及自定义上传按钮、提示信息和文件列表项`;
          break;
        case 'preview':
          // 预览组件支持的属性
          const previewProps = { 
            ...props, 
            'file-list': props['file-list'] || 'fileList',
            'model-value': props['model-value'] || 'showViewer',
            source: props.source || '[]',
            'need-loading': props['need-loading'] !== undefined ? props['need-loading'] : true,
            'loading-option': props['loading-option'] || '{ text: "Loading", background: "rgba(0, 0, 0, 0.3)" }',
            'has-pagination': props['has-pagination'] || false,
            'c-map-url-path': props['c-map-url-path'] || '',
            'hide-on-click-modal': props['hide-on-click-modal'] || false,
            'init-no-pagination': props['init-no-pagination'] || false,
            'has-download': props['has-download'] || false,
            'download-data': props['download-data'] || '{}',
            'download-loading': props['download-loading'] || false
          };
          
          // 生成预览组件代码，包含所有类型的预览组件
          componentCode = `<!-- 图片预览 -->
<LSPreviewImage v-model="${previewProps['model-value']}" :source="${previewProps.source}" :on-close="handlePreviewClose" :has-download="${previewProps['has-download']}" :hide-on-click-modal="${previewProps['hide-on-click-modal']}">
  <template #viewer>
    <!-- 自定义图片查看器内容 -->
  </template>
  <template #extra>
    <!-- 扩展内容 -->
  </template>
</LSPreviewImage>

<!-- 文档预览 -->
<LSPreviewDocx v-model="${previewProps['model-value']}" :source="${previewProps.source}" :on-close="handlePreviewClose" :hide-on-click-modal="${previewProps['hide-on-click-modal']}" :has-download="${previewProps['has-download']}" :on-download="handleDownload" />

<!-- PDF预览 -->
<LSPreviewPdf v-model="${previewProps['model-value']}" :source="${previewProps.source}" :on-close="handlePreviewClose" :c-map-url-path="${previewProps['c-map-url-path'] || '"/cmaps/"'}" :hide-on-click-modal="${previewProps['hide-on-click-modal']}" :init-no-pagination="${previewProps['init-no-pagination']}" :has-download="${previewProps['has-download']}" :on-download="handleDownload" />

<!-- Excel预览 -->
<LSPreviewXlsx v-model="${previewProps['model-value']}" :source="${previewProps.source}" :on-close="handlePreviewClose" :has-pagination="${previewProps['has-pagination']}" :has-download="${previewProps['has-download']}" :on-download="handleDownload" />`;
          
          explanation = `生成了@lingshugroup/web-plus预览组件，支持图片、文档、PDF、Excel等多种文件类型的预览，包含完整的属性和插槽`;
          break;

        case 'icon':
          const iconProps = { ...props, 'icon-config': props['icon-config'] || '{}' };
          componentCode = `<LSIcon ${generateProps(iconProps)}></LSIcon>`;
          explanation = `生成了@lingshugroup/web-plus图标组件，属性：${Object.keys(iconProps).join(', ')}`;
          break;
        case 'layout':
          componentCode = `<LSLayout ${generateProps(props)}>\n  <template #header>\n    <div>头部内容</div>\n  </template>\n  <template #aside>\n    <div>侧边栏内容</div>\n  </template>\n  <template #main>\n    <div>主内容</div>\n  </template>\n  <template #footer>\n    <div>底部内容</div>\n  </template>\n</LSLayout>`;
          explanation = `生成了@lingshugroup/web-plus布局组件，插槽：header, aside, main, footer`;
          break;
        case 'descriptions':
          const descriptionsProps = { ...props, list: props.list || 'descriptionsList' };
          componentCode = `<LSDescriptions ${generateProps(descriptionsProps)}></LSDescriptions>`;
          explanation = `生成了@lingshugroup/web-plus描述组件，属性：${Object.keys(descriptionsProps).join(', ')}`;
          break;
        case 'tree':
          const treeProps = { ...props, data: props.data || 'treeData' };
          componentCode = `<LSTree ${generateProps(treeProps)} @node-click="handleNodeClick"></LSTree>`;
          explanation = `生成了@lingshugroup/web-plus树组件，属性：${Object.keys(treeProps).join(', ')}，事件：node-click`;
          break;
        case 'map':
          const mapProps = { ...props, markers: props.markers || 'markers' };
          componentCode = `<LSMap ${generateProps(mapProps)} @marker-click="handleMarkerClick"></LSMap>`;
          explanation = `生成了@lingshugroup/web-plus地图组件，属性：${Object.keys(mapProps).join(', ')}，事件：marker-click`;
          break;
        case 'live':
          const liveProps = { ...props, url: props.url || 'liveUrl' };
          componentCode = `<LSLive ${generateProps(liveProps)} @play="handlePlay" @pause="handlePause"></LSLive>`;
          explanation = `生成了@lingshugroup/web-plus直播组件，属性：${Object.keys(liveProps).join(', ')}，事件：play, pause`;
          break;
        case 'jsonEditor':
          const jsonEditorProps = { ...props, value: props.value || 'jsonValue' };
          componentCode = `<LSJsonEditor ${generateProps(jsonEditorProps)} @change="handleJsonChange"></LSJsonEditor>`;
          explanation = `生成了@lingshugroup/web-plus JSON编辑器组件，属性：${Object.keys(jsonEditorProps).join(', ')}，事件：change`;
          break;
        case 'editor':
          const editorProps = { ...props, modelValue: props.modelValue || 'content' };
          componentCode = `<LSEditor v-model="${editorProps.modelValue}" ${generateProps(editorProps)} @change="handleEditorChange"></LSEditor>`;
          explanation = `生成了@lingshugroup/web-plus编辑器组件，属性：${Object.keys(editorProps).join(', ')}，事件：change`;
          break;
        case 'list':
          const listProps = { ...props, data: props.data || 'listData' };
          componentCode = `<LSList ${generateProps(listProps)}>\n  <template #item="{ item, index }">\n    <div>{{ index + 1 }}. {{ item.title }}</div>\n  </template>\n  <template #empty>\n    <div>暂无数据</div>\n  </template>\n</LSList>`;
          explanation = `生成了@lingshugroup/web-plus列表组件，属性：${Object.keys(listProps).join(', ')}，插槽：item, empty`;
          break;
        case 'chart':
          const chartProps = { ...props, data: props.data || 'chartData' };
          componentCode = `<LSChart ${generateProps(chartProps)} @chart-click="handleChartClick"></LSChart>`;
          explanation = `生成了@lingshugroup/web-plus图表组件，属性：${Object.keys(chartProps).join(', ')}，事件：chart-click`;
          break;
        case 'backTop':
          const backTopProps = { ...props, 'visibility-height': props['visibility-height'] || 300 };
          componentCode = `<LSBackTop ${generateProps(backTopProps)} @click="handleBackTopClick"></LSBackTop>`;
          explanation = `生成了@lingshugroup/web-plus回到顶部组件，属性：${Object.keys(backTopProps).join(', ')}，事件：click`;
          break;
        case 'breadcrumb':
          const breadcrumbProps = { ...props, list: props.list || 'breadcrumbList' };
          componentCode = `<LSBreadcrumb ${generateProps(breadcrumbProps)} @item-click="handleBreadcrumbClick"></LSBreadcrumb>`;
          explanation = `生成了@lingshugroup/web-plus面包屑组件，属性：${Object.keys(breadcrumbProps).join(', ')}，事件：item-click`;
          break;
        case 'menu':
          const menuProps = { ...props, menu: props.menu || 'menuData' };
          componentCode = `<LSMenu ${generateProps(menuProps)} @menu-click="handleMenuClick"></LSMenu>`;
          explanation = `生成了@lingshugroup/web-plus菜单组件，属性：${Object.keys(menuProps).join(', ')}，事件：menu-click`;
          break;
        case 'confirm':
          componentCode = `// 使 用 方法\nLSConfirm({\n  title: '${props.title || '确认'}',\n  message: '${props.message || '确定要执行此操作吗？'}',\n  confirmBtnText: '${props.confirmBtnText || '确定'}',\n  cancelBtnText: '${props.cancelBtnText || '取消'}'\n}).then(() => {\n  // 确认操作\n  ${props.onConfirm || 'console.log("确认操作");'}\n}).catch(() => {\n  // 取消操作\n  ${props.onCancel || 'console.log("取消操作");'}\n});`;
          explanation = `生成了@lingshugroup/web-plus确认对话框组件，方法：then, catch`;
          break;
        case 'bellMessage':
          componentCode = `//  使用方法\n LSBellMessage({\n  message: '${props.message || '通知内容'}',\n  type: '${props.type || 'success'}',\n  duration: ${props.duration || 3000},\n  showClose: ${props.showClose || true}\n});`;
          explanation = `生成了@lingshugroup/web-plus通知组件，属性：message, type, duration, showClose`;
          break;
        case 'dialog':
          const dialogProps = { ...props, modelValue: props.modelValue || 'dialogVisible', title: props.title || '对话框' };
          componentCode = `<LSDialog v-model="${dialogProps.modelValue}" ${generateProps(dialogProps)} @open="handleDialogOpen" @close="handleDialogClose">\n  <template #default>\n    <div>对话框内容</div>\n  </template>\n  <template #footer>\n    <LSButton @click="${dialogProps.modelValue} = false">取消</LSButton>\n    <LSButton type="primary" @click="handleDialogConfirm">确定</LSButton>\n  </template>\n</LSDialog>`;
          explanation = `生成了@lingshugroup/web-plus对话框组件，属性：${Object.keys(dialogProps).join(', ')}，事件：open, close，插槽：default, footer`;
          break;
        case 'print':
          const printProps = { ...props, content: props.content || 'printContent' };
          componentCode = `<LSPrint ${generateProps(printProps)} @print="handlePrint" @print-end="handlePrintEnd"></LSPrint>`;
          explanation = `生成了@lingshugroup/web-plus打印组件，属性：${Object.keys(printProps).join(', ')}，事件：print, print-end`;
          break;
        case 'containerBox':
          const containerBoxProps = { ...props, title: props.title || '容器标题' };
          componentCode = `<LSContainerBox ${generateProps(containerBoxProps)}>\n  <template #header>\n    <div>自定义头部</div>\n  </template>\n  <template #default>\n    <div>容器内容</div>\n  </template>\n  <template #footer>\n    <div>自定义底部</div>\n  </template>\n</LSContainerBox>`;
          explanation = `生成了@lingshugroup/web-plus容器组件，属性：${Object.keys(containerBoxProps).join(', ')}，插槽：header, default, footer`;
          break;
        case 'tooltip':
          const tooltipProps = { ...props, content: props.content || '提示内容' };
          componentCode = `<LSTooltip ${generateProps(tooltipProps)} @show="handleTooltipShow" @hide="handleTooltipHide">\n  <span>悬停我</span>\n</LSTooltip>`;
          explanation = `生成了@lingshugroup/web-plus提示组件，属性：${Object.keys(tooltipProps).join(', ')}，事件：show, hide`;
          break;
        default:
          throw new Error(`未知的@lingshugroup/web-plus组件类型：${baseType}`);
      }
      
      // 添加导入说明
      const importInstructions = `// 导入 @lingshugroup/web-plus 组件\nimport { LSButton, LSForm, LSFormItem, LSUpload, LSTable, LSPreview, LSPreviewImage, LSPreviewDocx, LSPreviewPdf, LSPreviewXlsx, LSIcon, LSLayout, LSDescriptions, LSTree, LSMap, LSLive, LSJsonEditor, LSEditor, LSList, LSChart, LSBackTop, LSBreadcrumb, LSMenu, LSConfirm, LSBellMessage, LSDialog, LSPrint, LSContainerBox, LSTooltip } from '@lingshugroup/web-plus';\n\n// 导入样式\nimport 'element-plus/dist/index.css';\nimport '@lingshugroup/web-plus/index.css';`;

      // 添加方法说明
      const methodInstructions = `// 组件相关方法\n// ${explanation.includes('事件') ? '事件处理方法：' : '方法说明：'}\n${componentCode.includes('handleButtonClick') ? 'const handleButtonClick = (event) => { console.log("按钮点击:", event); };\nconst handleMouseEnter = (event) => { console.log("鼠标进入:", event); };\nconst handleMouseLeave = (event) => { console.log("鼠标离开:", event); };\n' : ''}${componentCode.includes('handleSizeChange') ? 'const handleSizeChange = (size) => { console.log("每页条数改变:", size); };\nconst handleCurrentPageChange = (page) => { console.log("当前页码改变:", page); };\n' : ''}${componentCode.includes('handleFormSubmit') ? 'const handleFormSubmit = (formData) => { console.log("表单提交:", formData); };\nconst handleFormReset = (formData) => { console.log("表单重置:", formData); };\nconst handleFormChange = (value, prop, index) => { console.log("表单值改变:", value, prop, index); };\nconst handleFormDataChange = (value, prop, form) => { console.log("表单数据更新:", value, prop, form); };\n' : ''}${componentCode.includes('handleUploadError') ? 'const handleUploadError = (msg) => { console.log("上传错误:", msg); };\nconst handleHttpResponse = (data) => { console.log("上传响应:", data); };\nconst handleFileChange = (file) => { console.log("文件更新:", file); };\nconst handleImageCropper = (file, index) => { console.log("图片裁剪:", file, index); };\nconst handleUploadSuccess = (response, file, fileList) => { console.log("上传成功:", response, file, fileList); };\nconst handleFileRemove = (file, fileList) => { console.log("文件移除:", file, fileList); };\nconst handleCustomRemove = (file) => { console.log("自定义删除:", file); };\n' : ''}${componentCode.includes('handlePreviewClose') ? 'const handlePreviewClose = () => { console.log("预览关闭"); showViewer = false; };\nconst handleDownload = (data) => { console.log("下载回调:", data); };\n' : ''}${componentCode.includes('@node-click') ? 'const handleNodeClick = (node) => { console.log(node); };\n' : ''}${componentCode.includes('@marker-click') ? 'const handleMarkerClick = (marker) => { console.log("标记点击:", marker); };\n' : ''}${componentCode.includes('@play') ? 'const handlePlay = () => { console.log("播放"); };\nconst handlePause = () => { console.log("暂停"); };\n' : ''}${componentCode.includes('@change') ? 'const handleJsonChange = (value) => { console.log("JSON变化:", value); };\nconst handleEditorChange = (value) => { console.log("编辑器变化:", value); };\n' : ''}${componentCode.includes('@chart-click') ? 'const handleChartClick = (params) => { console.log("图表点击:", params); };\n' : ''}${componentCode.includes('@click') ? 'const handleBackTopClick = () => { console.log("回到顶部"); };\nconst handleBreadcrumbClick = (item) => { console.log("面包屑点击:", item); };\nconst handleMenuClick = (item) => { console.log("菜单点击:", item); };\nconst handleDialogOpen = () => { console.log("对话框打开"); };\nconst handleDialogClose = () => { console.log("对话框关闭"); };\nconst handleDialogConfirm = () => { console.log("对话框确认"); };\nconst handlePrint = () => { console.log("开始打印"); };\nconst handlePrintEnd = () => { console.log("打印结束"); };\n' : ''}${componentCode.includes('@show') ? 'const handleTooltipShow = () => { console.log("提示显示"); };\nconst handleTooltipHide = () => { console.log("提示隐藏"); };\n' : ''}${componentCode.includes('submitForm') ? 'const submitForm = () => { console.log("表单提交"); };\n' : ''}`;

      return {
        componentType,
        config,
        code: `${importInstructions}\n\n${componentCode}\n\n${methodInstructions}`,
        explanation
      };
    } else if (componentType.startsWith('ls-')) {
      // ls-components-plus 组件
      const baseType = componentType.substring(3);
      switch (baseType) {
    case 'button':
      const lsButtonProps = { ...props, 'icon-config': props['icon-config'] || '{}' };
      componentCode = `<LSButton ${generateProps(lsButtonProps)}>主要按钮</LSButton>`;
      explanation = `生成了ls-components-plus按钮组件，属性：${Object.keys(lsButtonProps).join(', ')}`;
      break;
    case 'table':
      const lsTableProps = { 
        ...props, 
        'table-column': props['table-column'] || 'tableColumn', 
        'table-data': props['table-data'] || 'tableData'
      };
      componentCode = `<LSTable ${generateProps(lsTableProps)}></LSTable>`;
      explanation = `生成了ls-components-plus表格组件，属性：${Object.keys(lsTableProps).join(', ')}`;
      break;
    case 'form':
      const lsFormProps = { ...props, model: props.model || 'form' };
      componentCode = `<LSForm ${generateProps(lsFormProps)}>\n  <LSFormItem label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </LSFormItem>\n  <LSFormItem label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </LSFormItem>\n  <LSFormItem>\n    <LSButton type="primary" @click="submitForm">提交</LSButton>\n  </LSFormItem>\n</LSForm>`;
      explanation = `生成了ls-components-plus表单组件，属性：${Object.keys(lsFormProps).join(', ')}`;
      break;
    case 'upload':
      const lsUploadProps = { 
        ...props, 
        action: props.action || '/api/upload',
        isCover: props.isCover !== undefined ? props.isCover : true,
        limitFile: props.limitFile || [],
        limitFileMsg: props.limitFileMsg || '',
        limitSize: props.limitSize || 2,
        limitUnit: props.limitUnit || 'MB',
        limitSizeMsg: props.limitSizeMsg || '',
        limitNumMsg: props.limitNumMsg || '',
        limitAllFail: props.limitAllFail !== undefined ? props.limitAllFail : false,
        httpRequestFunc: props.httpRequestFunc || '',
        formRuleFunc: props.formRuleFunc || '',
        formValidateFunc: props.formValidateFunc || '',
        isToast: props.isToast !== undefined ? props.isToast : true,
        emptyFileMsg: props.emptyFileMsg || '',
        profile: props.profile !== undefined ? props.profile : false,
        defProfile: props.defProfile || '',
        hideCoverBtn: props.hideCoverBtn !== undefined ? props.hideCoverBtn : false,
        tipContent: props.tipContent || '',
        hideBtnReachLimit: props.hideBtnReachLimit !== undefined ? props.hideBtnReachLimit : false
      };
      componentCode = `<LSUpload ${generateProps(lsUploadProps)}></LSUpload>`;
      explanation = `生成了ls-components-plus上传组件，属性：${Object.keys(lsUploadProps).join(', ')}`;
      break;
    case 'preview':
      const lsPreviewProps = { ...props, 'file-list': props['file-list'] || 'fileList' };
      componentCode = `<LSPreview ${generateProps(lsPreviewProps)}></LSPreview>`;
      explanation = `生成了ls-components-plus预览组件，属性：${Object.keys(lsPreviewProps).join(', ')}`;
      break;
        default:
          throw new Error(`未知的ls-components-plus组件类型：${baseType}`);
      }
      
      // 添加导入说明
      const importInstructions = `// 导入 ls-components-plus 组件\nimport { LSButton, LSForm, LSFormItem, LSUpload, LSTable, LSPreview } from 'ls-components-plus';\n\n// 导入样式\nimport 'element-plus/dist/index.css';\nimport 'ls-components-plus/dist/index.css';`;

      // 添加方法说明
      const methodInstructions = `// 组件相关方法\n// ${explanation.includes('事件') ? '事件处理方法：' : '方法说明：'}\n${componentCode.includes('submitForm') ? 'const submitForm = () => { console.log("表单提交"); };\n' : ''}`;

      return {
        componentType,
        config,
        code: `${importInstructions}\n\n${componentCode}\n\n${methodInstructions}`,
        explanation
      };
    } else {
      // 默认使用 Web Plus 组件（优先）
      switch (componentType) {
        case 'button':
          const defaultButtonProps = { ...props, type: props.type || 'primary' };
          componentCode = `<LSButton ${generateProps(defaultButtonProps)}>主要按钮</LSButton>`;
          explanation = `生成了@lingshugroup/web-plus按钮组件，属性：${Object.keys(defaultButtonProps).join(', ')}`;
          break;
        case 'input':
          const defaultInputProps = { ...props, placeholder: props.placeholder || '请输入内容' };
          componentCode = `<el-input v-model="inputValue" ${generateProps(defaultInputProps)}></el-input>`;
          explanation = `生成了Element Plus输入组件（与@lingshugroup/web-plus配合使用），属性：${Object.keys(defaultInputProps).join(', ')}`;
          break;
        case 'table':
          const defaultTableProps = {
            ...props,
            'table-column': props['table-column'] || 'tableColumn',
            'table-data': props['table-data'] || 'tableData'
          };
          componentCode = `<LSTable ${generateProps(defaultTableProps)}></LSTable>`;
          explanation = `生成了@lingshugroup/web-plus表格组件，属性：${Object.keys(defaultTableProps).join(', ')}`;
          break;
        case 'form':
          const defaultFormProps = { ...props, model: props.model || 'form' };
          componentCode = `<LSForm ${generateProps(defaultFormProps)}>\n  <LSFormItem label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </LSFormItem>\n  <LSFormItem label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </LSFormItem>\n  <LSFormItem>\n    <LSButton type="primary" @click="submitForm">提交</LSButton>\n  </LSFormItem>\n</LSForm>`;
          explanation = `生成了@lingshugroup/web-plus表单组件，属性：${Object.keys(defaultFormProps).join(', ')}`;
          break;
        default:
          // 如果Web Plus没有对应组件，回退到Element Plus
          switch (componentType) {
            case 'button':
              const elButtonProps = { ...props, type: props.type || 'primary' };
              componentCode = `<el-button ${generateProps(elButtonProps)}>主要按钮</el-button>`;
              explanation = `生成了Element Plus按钮组件，属性：${Object.keys(elButtonProps).join(', ')}`;
              break;
            case 'input':
              const elInputProps = { ...props, placeholder: props.placeholder || '请输入内容' };
              componentCode = `<el-input v-model="inputValue" ${generateProps(elInputProps)}></el-input>`;
              explanation = `生成了Element Plus输入组件，属性：${Object.keys(elInputProps).join(', ')}`;
              break;
            case 'table':
              const elTableProps = { ...props, data: props.data || 'tableData' };
              componentCode = `<el-table ${generateProps(elTableProps)}>\n  <el-table-column prop="date" label="日期"></el-table-column>\n  <el-table-column prop="name" label="姓名"></el-table-column>\n  <el-table-column prop="address" label="地址"></el-table-column>\n</el-table>`;
              explanation = `生成了Element Plus表格组件，属性：${Object.keys(elTableProps).join(', ')}`;
              break;
            case 'form':
              const elFormProps = { ...props, model: props.model || 'form' };
              componentCode = `<el-form ${generateProps(elFormProps)}>\n  <el-form-item label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </el-form-item>\n  <el-form-item label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </el-form-item>\n  <el-form-item>\n    <el-button type="primary" @click="submitForm">提交</el-button>\n  </el-form-item>\n</el-form>`;
              explanation = `生成了Element Plus表单组件，属性：${Object.keys(elFormProps).join(', ')}`;
              break;
            default:
              throw new Error(`未知的组件类型：${componentType}`);
          }
      }

      // 添加导入说明
      const importInstructions = `// 导入 @lingshugroup/web-plus 组件\nimport { LSButton, LSForm, LSFormItem, LSUpload, LSTable, LSPreview, LSPreviewImage, LSPreviewDocx, LSPreviewPdf, LSPreviewXlsx, LSIcon, LSLayout, LSDescriptions, LSTree, LSMap, LSLive, LSJsonEditor, LSEditor, LSList, LSChart, LSBackTop, LSBreadcrumb, LSMenu, LSConfirm, LSBellMessage, LSDialog, LSPrint, LSContainerBox, LSTooltip } from '@lingshugroup/web-plus';\n\n// 导入样式\nimport 'element-plus/dist/index.css';\nimport '@lingshugroup/web-plus/index.css';`;

      // 添加方法说明
    const methodInstructions = `// 组件相关方法\n// ${explanation.includes('事件') ? '事件处理方法：' : '方法说明：'}\n${componentCode.includes('handleButtonClick') ? 'const handleButtonClick = (event) => { console.log("按钮点击:", event); };\nconst handleMouseEnter = (event) => { console.log("鼠标进入:", event); };\nconst handleMouseLeave = (event) => { console.log("鼠标离开:", event); };\n' : ''}${componentCode.includes('handleSizeChange') ? 'const handleSizeChange = (size) => { console.log("每页条数改变:", size); };\nconst handleCurrentPageChange = (page) => { console.log("当前页码改变:", page); };\n' : ''}${componentCode.includes('handleFormSubmit') ? 'const handleFormSubmit = (formData) => { console.log("表单提交:", formData); };\nconst handleFormReset = (formData) => { console.log("表单重置:", formData); };\nconst handleFormChange = (value, prop, index) => { console.log("表单值改变:", value, prop, index); };\nconst handleFormDataChange = (value, prop, form) => { console.log("表单数据更新:", value, prop, form); };\n' : ''}${componentCode.includes('handleUploadError') ? 'const handleUploadError = (msg) => { console.log("上传错误:", msg); };\nconst handleHttpResponse = (data) => { console.log("上传响应:", data); };\nconst handleFileChange = (file) => { console.log("文件更新:", file); };\nconst handleImageCropper = (file, index) => { console.log("图片裁剪:", file, index); };\nconst handleUploadSuccess = (response, file, fileList) => { console.log("上传成功:", response, file, fileList); };\nconst handleFileRemove = (file, fileList) => { console.log("文件移除:", file, fileList); };\nconst handleCustomRemove = (file) => { console.log("自定义删除:", file); };\n' : ''}${componentCode.includes('handlePreviewClose') ? 'const handlePreviewClose = () => { console.log("预览关闭"); showViewer = false; };\nconst handleDownload = (data) => { console.log("下载回调:", data); };\n' : ''}${componentCode.includes('@node-click') ? 'const handleNodeClick = (node) => { console.log(node); };\n' : ''}${componentCode.includes('@marker-click') ? 'const handleMarkerClick = (marker) => { console.log(marker); };\n' : ''}${componentCode.includes('@play') ? 'const handlePlay = () => { console.log("播放"); };\nconst handlePause = () => { console.log("暂停"); };\n' : ''}${componentCode.includes('@change') ? 'const handleJsonChange = (value) => { console.log(value); };\nconst handleEditorChange = (value) => { console.log(value); };\n' : ''}${componentCode.includes('@chart-click') ? 'const handleChartClick = (params) => { console.log(params); };\n' : ''}${componentCode.includes('@click') ? 'const handleBackTopClick = () => { console.log("回到顶部"); };\nconst handleBreadcrumbClick = (item) => { console.log(item); };\nconst handleMenuClick = (item) => { console.log(item); };\n' : ''}${componentCode.includes('@open') ? 'const handleDialogOpen = () => { console.log("对话框打开"); };\nconst handleDialogClose = () => { console.log("对话框关闭"); };\nconst handleDialogConfirm = () => { console.log("对话框确认"); dialogVisible = false; };\n' : ''}${componentCode.includes('@print') ? 'const handlePrint = () => { console.log("开始打印"); };\nconst handlePrintEnd = () => { console.log("打印结束"); };\n' : ''}${componentCode.includes('@show') ? 'const handleTooltipShow = () => { console.log("提示显示"); };\nconst handleTooltipHide = () => { console.log("提示隐藏"); };\n' : ''}\n\n// 示例数据\n${componentCode.includes('formData') ? 'const formData = ref({});\nconst formItems = ref([]);\n' : ''}${componentCode.includes('tableData') ? 'const tableData = ref([]);\nconst tableColumn = ref([]);\n' : ''}${componentCode.includes('fileList') ? 'const fileList = ref([]);\n' : ''}${componentCode.includes('showViewer') ? 'const showViewer = ref(false);\nconst source = ref([]);\n' : ''}`;

      return {
        componentType,
        config,
        code: `${importInstructions}\n\n${componentCode}\n\n${methodInstructions}`,
        explanation
      };
    }
  }
  optimizeApi(code) {
    if (!code) {
      throw new Error('API代码优化需要提供代码');
    }

    const optimizedCode = `// 优化后的API代码\n${code}\n\n// 优化建议：\n// 1. 添加错误处理\n// 2. 优化参数验证\n// 3. 增加性能监控`;

    return {
      originalCode: code,
      optimizedCode,
      suggestions: [
        '添加错误处理',
        '优化参数验证',
        '增加性能监控'
      ]
    };
  }

}

module.exports = AIPromptTool;