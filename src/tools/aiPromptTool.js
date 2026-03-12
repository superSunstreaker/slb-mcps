const ToolBase = require('../core/toolBase');

class AIPromptTool extends ToolBase {
  constructor() {
    super(
      'ai-prompt',
      'AI prompt tool for generating Element Plus components and optimizing APIs',
      [
        {
          name: 'action',
          type: 'string',
          required: true,
          description: 'Action to perform: generate-component or optimize-api'
        },
        {
          name: 'componentType',
          type: 'string',
          required: false,
          description: 'Type of Element Plus component to generate'
        },
        {
          name: 'config',
          type: 'string',
          required: false,
          description: 'Configuration for component generation'
        },
        {
          name: 'code',
          type: 'string',
          required: false,
          description: 'API code to optimize'
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
        throw new Error(`Unknown action: ${action}`);
    }
  }

  generateComponent(componentType, config) {
    if (!componentType) {
      throw new Error('Component type is required for component generation');
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
          const buttonProps = { ...props, type: props.type || 'primary' };
          componentCode = `<LSButton ${generateProps(buttonProps)}>主要按钮</LSButton>`;
          explanation = `Generated @lingshugroup/web-plus button component with properties: ${Object.keys(buttonProps).join(', ')}`;
          break;
        case 'input':
          const inputProps = { ...props, placeholder: props.placeholder || '请输入内容' };
          componentCode = `<el-input v-model="inputValue" ${generateProps(inputProps)}></el-input>`;
          explanation = `Generated Element Plus input component (used with @lingshugroup/web-plus) with properties: ${Object.keys(inputProps).join(', ')}`;
          break;
        case 'table':
          const tableProps = { 
            ...props, 
            'table-column': props['table-column'] || 'tableColumn', 
            'table-data': props['table-data'] || 'tableData'
          };
          componentCode = `<LSTable ${generateProps(tableProps)}></LSTable>`;
          explanation = `Generated @lingshugroup/web-plus table component with properties: ${Object.keys(tableProps).join(', ')}`;
          break;
        case 'form':
          const formProps = { ...props, model: props.model || 'form' };
          componentCode = `<LSForm ${generateProps(formProps)}>\n  <LSFormItem label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </LSFormItem>\n  <LSFormItem label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </LSFormItem>\n  <LSFormItem>\n    <LSButton type="primary" @click="submitForm">提交</LSButton>\n  </LSFormItem>\n</LSForm>`;
          explanation = `Generated @lingshugroup/web-plus form component with properties: ${Object.keys(formProps).join(', ')}`;
          break;
        case 'upload':
          const uploadProps = { ...props, action: props.action || '/api/upload' };
          componentCode = `<LSUpload ${generateProps(uploadProps)}></LSUpload>`;
          explanation = `Generated @lingshugroup/web-plus upload component with properties: ${Object.keys(uploadProps).join(', ')}`;
          break;
        case 'preview':
          const previewProps = { ...props, 'file-list': props['file-list'] || 'fileList' };
          componentCode = `<!-- v1.0.34+之后不建议使用 -->\n<LSPreview ${generateProps(previewProps)}></LSPreview>\n\n<!-- v1.0.34+ 推荐使用 -->\n<LSPreviewImage ${generateProps(previewProps)}></LSPreviewImage>\n<LSPreviewDocx ${generateProps(previewProps)}></LSPreviewDocx>\n<LSPreviewPdf ${generateProps(previewProps)}></LSPreviewPdf>\n<LSPreviewXlsx ${generateProps(previewProps)}></LSPreviewXlsx>`;
          explanation = `Generated @lingshugroup/web-plus preview components with properties: ${Object.keys(previewProps).join(', ')}`;
          break;
        case 'icon':
          const iconProps = { ...props, 'icon-config': props['icon-config'] || '{}' };
          componentCode = `<LSIcon ${generateProps(iconProps)}></LSIcon>`;
          explanation = `Generated @lingshugroup/web-plus icon component with properties: ${Object.keys(iconProps).join(', ')}`;
          break;
        case 'layout':
          componentCode = `<LSLayout ${generateProps(props)}>\n  <template #header>\n    <div>头部内容</div>\n  </template>\n  <template #aside>\n    <div>侧边栏内容</div>\n  </template>\n  <template #main>\n    <div>主内容</div>\n  </template>\n  <template #footer>\n    <div>底部内容</div>\n  </template>\n</LSLayout>`;
          explanation = `Generated @lingshugroup/web-plus layout component with slots: header, aside, main, footer`;
          break;
        case 'descriptions':
          const descriptionsProps = { ...props, list: props.list || 'descriptionsList' };
          componentCode = `<LSDescriptions ${generateProps(descriptionsProps)}></LSDescriptions>`;
          explanation = `Generated @lingshugroup/web-plus descriptions component with properties: ${Object.keys(descriptionsProps).join(', ')}`;
          break;
        case 'tree':
          const treeProps = { ...props, data: props.data || 'treeData' };
          componentCode = `<LSTree ${generateProps(treeProps)} @node-click="handleNodeClick"></LSTree>`;
          explanation = `Generated @lingshugroup/web-plus tree component with properties: ${Object.keys(treeProps).join(', ')} and events: node-click`;
          break;
        case 'map':
          const mapProps = { ...props, markers: props.markers || 'markers' };
          componentCode = `<LSMap ${generateProps(mapProps)} @marker-click="handleMarkerClick"></LSMap>`;
          explanation = `Generated @lingshugroup/web-plus map component with properties: ${Object.keys(mapProps).join(', ')} and events: marker-click`;
          break;
        case 'live':
          const liveProps = { ...props, url: props.url || 'liveUrl' };
          componentCode = `<LSLive ${generateProps(liveProps)} @play="handlePlay" @pause="handlePause"></LSLive>`;
          explanation = `Generated @lingshugroup/web-plus live component with properties: ${Object.keys(liveProps).join(', ')} and events: play, pause`;
          break;
        case 'jsonEditor':
          const jsonEditorProps = { ...props, value: props.value || 'jsonValue' };
          componentCode = `<LSJsonEditor ${generateProps(jsonEditorProps)} @change="handleJsonChange"></LSJsonEditor>`;
          explanation = `Generated @lingshugroup/web-plus jsonEditor component with properties: ${Object.keys(jsonEditorProps).join(', ')} and events: change`;
          break;
        case 'editor':
          const editorProps = { ...props, modelValue: props.modelValue || 'content' };
          componentCode = `<LSEditor v-model="${editorProps.modelValue}" ${generateProps(editorProps)} @change="handleEditorChange"></LSEditor>`;
          explanation = `Generated @lingshugroup/web-plus editor component with properties: ${Object.keys(editorProps).join(', ')} and events: change`;
          break;
        case 'list':
          const listProps = { ...props, data: props.data || 'listData' };
          componentCode = `<LSList ${generateProps(listProps)}>\n  <template #item="{ item, index }">\n    <div>{{ index + 1 }}. {{ item.title }}</div>\n  </template>\n  <template #empty>\n    <div>暂无数据</div>\n  </template>\n</LSList>`;
          explanation = `Generated @lingshugroup/web-plus list component with properties: ${Object.keys(listProps).join(', ')} and slots: item, empty`;
          break;
        case 'chart':
          const chartProps = { ...props, data: props.data || 'chartData' };
          componentCode = `<LSChart ${generateProps(chartProps)} @chart-click="handleChartClick"></LSChart>`;
          explanation = `Generated @lingshugroup/web-plus chart component with properties: ${Object.keys(chartProps).join(', ')} and events: chart-click`;
          break;
        case 'backTop':
          const backTopProps = { ...props, 'visibility-height': props['visibility-height'] || 300 };
          componentCode = `<LSBackTop ${generateProps(backTopProps)} @click="handleBackTopClick"></LSBackTop>`;
          explanation = `Generated @lingshugroup/web-plus backTop component with properties: ${Object.keys(backTopProps).join(', ')} and events: click`;
          break;
        case 'breadcrumb':
          const breadcrumbProps = { ...props, list: props.list || 'breadcrumbList' };
          componentCode = `<LSBreadcrumb ${generateProps(breadcrumbProps)} @item-click="handleBreadcrumbClick"></LSBreadcrumb>`;
          explanation = `Generated @lingshugroup/web-plus breadcrumb component with properties: ${Object.keys(breadcrumbProps).join(', ')} and events: item-click`;
          break;
        case 'menu':
          const menuProps = { ...props, menu: props.menu || 'menuData' };
          componentCode = `<LSMenu ${generateProps(menuProps)} @menu-click="handleMenuClick"></LSMenu>`;
          explanation = `Generated @lingshugroup/web-plus menu component with properties: ${Object.keys(menuProps).join(', ')} and events: menu-click`;
          break;
        case 'confirm':
          componentCode = `// 使用方法\nLSConfirm({\n  title: '${props.title || '确认'}',\n  message: '${props.message || '确定要执行此操作吗？'}',\n  confirmBtnText: '${props.confirmBtnText || '确定'}',\n  cancelBtnText: '${props.cancelBtnText || '取消'}'\n}).then(() => {\n  // 确认操作\n  ${props.onConfirm || 'console.log("确认操作");'}\n}).catch(() => {\n  // 取消操作\n  ${props.onCancel || 'console.log("取消操作");'}\n});`;
          explanation = `Generated @lingshugroup/web-plus confirm component with methods: then, catch`;
          break;
        case 'bellMessage':
          componentCode = `// 使用方法\nLSBellMessage({\n  message: '${props.message || '通知内容'}',\n  type: '${props.type || 'success'}',\n  duration: ${props.duration || 3000},\n  showClose: ${props.showClose || true}\n});`;
          explanation = `Generated @lingshugroup/web-plus bellMessage component with properties: message, type, duration, showClose`;
          break;
        case 'dialog':
          const dialogProps = { ...props, modelValue: props.modelValue || 'dialogVisible', title: props.title || '对话框' };
          componentCode = `<LSDialog v-model="${dialogProps.modelValue}" ${generateProps(dialogProps)} @open="handleDialogOpen" @close="handleDialogClose">\n  <template #default>\n    <div>对话框内容</div>\n  </template>\n  <template #footer>\n    <LSButton @click="${dialogProps.modelValue} = false">取消</LSButton>\n    <LSButton type="primary" @click="handleDialogConfirm">确定</LSButton>\n  </template>\n</LSDialog>`;
          explanation = `Generated @lingshugroup/web-plus dialog component with properties: ${Object.keys(dialogProps).join(', ')}, events: open, close, and slots: default, footer`;
          break;
        case 'print':
          const printProps = { ...props, content: props.content || 'printContent' };
          componentCode = `<LSPrint ${generateProps(printProps)} @print="handlePrint" @print-end="handlePrintEnd"></LSPrint>`;
          explanation = `Generated @lingshugroup/web-plus print component with properties: ${Object.keys(printProps).join(', ')} and events: print, print-end`;
          break;
        case 'containerBox':
          const containerBoxProps = { ...props, title: props.title || '容器标题' };
          componentCode = `<LSContainerBox ${generateProps(containerBoxProps)}>\n  <template #header>\n    <div>自定义头部</div>\n  </template>\n  <template #default>\n    <div>容器内容</div>\n  </template>\n  <template #footer>\n    <div>自定义底部</div>\n  </template>\n</LSContainerBox>`;
          explanation = `Generated @lingshugroup/web-plus containerBox component with properties: ${Object.keys(containerBoxProps).join(', ')} and slots: header, default, footer`;
          break;
        case 'tooltip':
          const tooltipProps = { ...props, content: props.content || '提示内容' };
          componentCode = `<LSTooltip ${generateProps(tooltipProps)} @show="handleTooltipShow" @hide="handleTooltipHide">\n  <span>悬停我</span>\n</LSTooltip>`;
          explanation = `Generated @lingshugroup/web-plus tooltip component with properties: ${Object.keys(tooltipProps).join(', ')} and events: show, hide`;
          break;
        default:
          throw new Error(`Unknown @lingshugroup/web-plus component type: ${baseType}`);
      }
    } else if (componentType.startsWith('ls-')) {
      // ls-components-plus 组件
      const baseType = componentType.substring(3);
      switch (baseType) {
        case 'button':
          const lsButtonProps = { ...props, 'icon-config': props['icon-config'] || '{}' };
          componentCode = `<ls-button ${generateProps(lsButtonProps)}>主要按钮</ls-button>`;
          explanation = `Generated ls-components-plus button component with properties: ${Object.keys(lsButtonProps).join(', ')}`;
          break;
        case 'table':
          const lsTableProps = { 
            ...props, 
            'table-column': props['table-column'] || 'tableColumn', 
            'table-data': props['table-data'] || 'tableData'
          };
          componentCode = `<ls-table ${generateProps(lsTableProps)}></ls-table>`;
          explanation = `Generated ls-components-plus table component with properties: ${Object.keys(lsTableProps).join(', ')}`;
          break;
        case 'form':
          const lsFormProps = { ...props, model: props.model || 'form' };
          componentCode = `<ls-form ${generateProps(lsFormProps)}>\n  <ls-form-item label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </ls-form-item>\n  <ls-form-item label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </ls-form-item>\n  <ls-form-item>\n    <ls-button type="primary" @click="submitForm">提交</ls-button>\n  </ls-form-item>\n</ls-form>`;
          explanation = `Generated ls-components-plus form component with properties: ${Object.keys(lsFormProps).join(', ')}`;
          break;
        case 'upload':
          const lsUploadProps = { ...props, action: props.action || '/api/upload' };
          componentCode = `<ls-upload ${generateProps(lsUploadProps)}></ls-upload>`;
          explanation = `Generated ls-components-plus upload component with properties: ${Object.keys(lsUploadProps).join(', ')}`;
          break;
        case 'preview':
          const lsPreviewProps = { ...props, 'file-list': props['file-list'] || 'fileList' };
          componentCode = `<ls-preview ${generateProps(lsPreviewProps)}></ls-preview>`;
          explanation = `Generated ls-components-plus preview component with properties: ${Object.keys(lsPreviewProps).join(', ')}`;
          break;
        default:
          throw new Error(`Unknown ls-components-plus component type: ${baseType}`);
      }
    } else {
      // 默认使用 Web Plus 组件（优先）
      switch (componentType) {
        case 'button':
          const defaultButtonProps = { ...props, type: props.type || 'primary' };
          componentCode = `<LSButton ${generateProps(defaultButtonProps)}>主要按钮</LSButton>`;
          explanation = `Generated @lingshugroup/web-plus button component with properties: ${Object.keys(defaultButtonProps).join(', ')}`;
          break;
        case 'input':
          const defaultInputProps = { ...props, placeholder: props.placeholder || '请输入内容' };
          componentCode = `<el-input v-model="inputValue" ${generateProps(defaultInputProps)}></el-input>`;
          explanation = `Generated Element Plus input component (used with @lingshugroup/web-plus) with properties: ${Object.keys(defaultInputProps).join(', ')}`;
          break;
        case 'table':
          const defaultTableProps = { 
            ...props, 
            'table-column': props['table-column'] || 'tableColumn', 
            'table-data': props['table-data'] || 'tableData'
          };
          componentCode = `<LSTable ${generateProps(defaultTableProps)}></LSTable>`;
          explanation = `Generated @lingshugroup/web-plus table component with properties: ${Object.keys(defaultTableProps).join(', ')}`;
          break;
        case 'form':
          const defaultFormProps = { ...props, model: props.model || 'form' };
          componentCode = `<LSForm ${generateProps(defaultFormProps)}>\n  <LSFormItem label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </LSFormItem>\n  <LSFormItem label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </LSFormItem>\n  <LSFormItem>\n    <LSButton type="primary" @click="submitForm">提交</LSButton>\n  </LSFormItem>\n</LSForm>`;
          explanation = `Generated @lingshugroup/web-plus form component with properties: ${Object.keys(defaultFormProps).join(', ')}`;
          break;
        default:
          // 如果Web Plus没有对应组件，回退到Element Plus
          switch (componentType) {
            case 'button':
              const elButtonProps = { ...props, type: props.type || 'primary' };
              componentCode = `<el-button ${generateProps(elButtonProps)}>主要按钮</el-button>`;
              explanation = `Generated Element Plus button component with properties: ${Object.keys(elButtonProps).join(', ')}`;
              break;
            case 'input':
              const elInputProps = { ...props, placeholder: props.placeholder || '请输入内容' };
              componentCode = `<el-input v-model="inputValue" ${generateProps(elInputProps)}></el-input>`;
              explanation = `Generated Element Plus input component with properties: ${Object.keys(elInputProps).join(', ')}`;
              break;
            case 'table':
              const elTableProps = { ...props, data: props.data || 'tableData' };
              componentCode = `<el-table ${generateProps(elTableProps)}>\n  <el-table-column prop="date" label="日期"></el-table-column>\n  <el-table-column prop="name" label="姓名"></el-table-column>\n  <el-table-column prop="address" label="地址"></el-table-column>\n</el-table>`;
              explanation = `Generated Element Plus table component with properties: ${Object.keys(elTableProps).join(', ')}`;
              break;
            case 'form':
              const elFormProps = { ...props, model: props.model || 'form' };
              componentCode = `<el-form ${generateProps(elFormProps)}>\n  <el-form-item label="用户名">\n    <el-input v-model="form.username"></el-input>\n  </el-form-item>\n  <el-form-item label="密码">\n    <el-input v-model="form.password" type="password"></el-input>\n  </el-form-item>\n  <el-form-item>\n    <el-button type="primary" @click="submitForm">提交</el-button>\n  </el-form-item>\n</el-form>`;
              explanation = `Generated Element Plus form component with properties: ${Object.keys(elFormProps).join(', ')}`;
              break;
            default:
              throw new Error(`Unknown component type: ${componentType}`);
          }
      }
    }

    // 添加导入说明
    const importInstructions = `// 导入 @lingshugroup/web-plus 组件\nimport { LSButton, LSForm, LSFormItem, LSUpload, LSTable, LSPreview, LSPreviewImage, LSPreviewDocx, LSPreviewPdf, LSPreviewXlsx, LSIcon, LSLayout, LSDescriptions, LSTree, LSMap, LSLive, LSJsonEditor, LSEditor, LSList, LSChart, LSBackTop, LSBreadcrumb, LSMenu, LSConfirm, LSBellMessage, LSDialog, LSPrint, LSContainerBox, LSTooltip } from '@lingshugroup/web-plus';\n\n// 导入样式\nimport 'element-plus/dist/index.css';\nimport '@lingshugroup/web-plus/index.css';`;

    // 添加方法说明
    const methodInstructions = `// 组件相关方法\n// ${explanation.includes('events') ? '事件处理方法：' : '方法说明：'}\n${componentCode.includes('@node-click') ? 'const handleNodeClick = (node) => { console.log(node); };\n' : ''}${componentCode.includes('@marker-click') ? 'const handleMarkerClick = (marker) => { console.log(marker); };\n' : ''}${componentCode.includes('@play') ? 'const handlePlay = () => { console.log("播放"); };\nconst handlePause = () => { console.log("暂停"); };\n' : ''}${componentCode.includes('@change') ? 'const handleJsonChange = (value) => { console.log(value); };\nconst handleEditorChange = (value) => { console.log(value); };\n' : ''}${componentCode.includes('@chart-click') ? 'const handleChartClick = (params) => { console.log(params); };\n' : ''}${componentCode.includes('@click') ? 'const handleBackTopClick = () => { console.log("回到顶部"); };\nconst handleBreadcrumbClick = (item) => { console.log(item); };\nconst handleMenuClick = (item) => { console.log(item); };\n' : ''}${componentCode.includes('@open') ? 'const handleDialogOpen = () => { console.log("对话框打开"); };\nconst handleDialogClose = () => { console.log("对话框关闭"); };\nconst handleDialogConfirm = () => { console.log("对话框确认"); dialogVisible = false; };\n' : ''}${componentCode.includes('@print') ? 'const handlePrint = () => { console.log("开始打印"); };\nconst handlePrintEnd = () => { console.log("打印结束"); };\n' : ''}${componentCode.includes('@show') ? 'const handleTooltipShow = () => { console.log("提示显示"); };\nconst handleTooltipHide = () => { console.log("提示隐藏"); };\n' : ''}${componentCode.includes('submitForm') ? 'const submitForm = () => { console.log(form); };\n' : ''}`;

    return {
      componentType,
      config,
      code: `${importInstructions}\n\n${componentCode}\n\n${methodInstructions}`,
      explanation
    };
  }

  optimizeApi(code) {
    if (!code) {
      throw new Error('API code is required for optimization');
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