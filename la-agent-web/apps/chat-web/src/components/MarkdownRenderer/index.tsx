import ImageGallery from '@/components/ImageGallery';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { t } from '@bmos/i18n';
import { App, Button, Flex } from 'antd';
import ReactECharts from 'echarts-for-react';
import { flow } from 'lodash-es';
import { memo, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import RehypeKatex from 'rehype-katex';
import RehypeRaw from 'rehype-raw';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import SvgIcon from '../SvgIcon';

/**
 * 将内容中的自定义<think>标签转换为HTML<details>元素。
 *
 * 此函数用于替换输入字符串中出现的<think>标签
 * 带有<details data think=true>和</inthink>标签
 * [ENDTHINKFLAG]</details>。这种转换对于处理
 * 用于Markdown渲染中特殊处理的自定义标记。
 *
 * @param content -包含<think>标签的输入字符串。
 * @returns 返回转换后的字符串，其中<think>标签被<details>标签替换。
 */

const preprocessThinkTag = (content: string) => {
  return flow([
    (str: string) => str.replace('<think>\n', '<details>\n<summary>Think</summary>\n'),
    (str: string) => str.replace('\n</think>', '\n</details>'),
  ])(content);
};

/**
 * 处理字符串中的 LaTeX 内容，将 LaTeX 分隔符转换为兼容 Markdown 渲染的格式。
 * 为避免在代码块中处理 LaTeX，将代码块临时替换为占位符。
 *
 * - 将 \[ ... \] 和 \(...\) 替换为 $$ ... $$。
 * - 确保单个美元符号 $...$ 除非被转义，否则保持不变。
 * - 处理 LaTeX 后恢复代码块。
 *
 * @param content - 包含 LaTeX 语法的字符串内容。
 * @returns 处理后的字符串，LaTeX 分隔符已转换。
 */

const preprocessLaTeX = (content: string) => {
  if (typeof content !== 'string')
    return content;

  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = content.match(codeBlockRegex) || [];
  let processedContent = content.replace(codeBlockRegex, 'CODE_BLOCK_PLACEHOLDER');

  processedContent = flow([
    (str: string) => str.replace(/\\\[(.*?)\\\]/g, (_, equation) => `$$${equation}$$`),
    (str: string) => str.replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`),
    (str: string) => str.replace(/\\\((.*?)\\\)/g, (_, equation) => `$$${equation}$$`),
    (str: string) => str.replace(/(^|[^\\])\$(.+?)\$/g, (_, prefix, equation) => `${prefix}$${equation}$`),
  ])(processedContent);

  codeBlocks.forEach((block) => {
    processedContent = processedContent.replace('CODE_BLOCK_PLACEHOLDER', block);
  });

  return processedContent;
};

const DetailsBlock: React.FC<{
  node: {
    children: any[];
  };
}> = ({ node }) => {
  const { children } = node;
  const content = children.map((child: any, idx: number) => (
    <p key={idx} style={{ margin: '4px 0' }}>{child.value}</p>
  ));
  const [open, setOpen] = useState(true);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    const handleToggle = () => {
      setOpen(details?.open ?? false);
    };

    details?.addEventListener('toggle', handleToggle);
    return () => {
      details?.removeEventListener('toggle', handleToggle);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      open={open}
      style={{
        backgroundColor: 'rgb(248, 248, 248)',
        color: 'gray',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '20px',
      }}
    >
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          color: '#242526',
          cursor: 'pointer',
          marginBottom: '8px',
          gap: '8px',
        }}
      >
        <SvgIcon name="Think" size={20} />
        <span style={{ fontSize: '16px' }}>{t('深度思考')}</span>
        {open ? <DownOutlined size={16} /> : <RightOutlined size={16} />}
      </summary>
      <div>{content}</div>
    </details>
  );
};

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // 防止页面滚动
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const success = document.execCommand('copy');
    console.log(success ? '复制成功' : '复制失败');
  }
  catch (err) {
    console.error('复制异常', err);
    throw err;
  }
  document.body.removeChild(textarea);
};

const CodeBlock: React.FC<{
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children }) => {
  const { message } = App.useApp();
  if (children === undefined) {
    return null;
  }
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];
  const copy = (content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
    else {
      fallbackCopy(content);
    }
    message.success(t('复制成功'));
  };
  if (inline || !lang) {
    const codeCom = (
      <div style={{ margin: '8px 0', borderRadius: '4px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        <code className={className}>{children}</code>
      </div>
    );
    try {
      const jsonChildren = JSON.parse(String(children));
      const { action, action_input } = jsonChildren;
      if (!action) {
        return codeCom;
      }
      else if (action === 'Final Answer') {
        return (
          <div style={{ margin: '8px 0', borderRadius: '4px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {String(action_input)}
          </div>
        );
      }
      else {
        return undefined;
      }
    }
    catch (_e) {
      return codeCom;
    }
  }
  // lang = charts,使用图表
  if (lang === 'chart') {
    try {
      let chartInfo = JSON.parse(String(children));
      if (typeof chartInfo === 'string') {
        chartInfo = JSON.parse(chartInfo);
      }
      const chartType = chartInfo.chartType;
      let options = {};
      if (chartType === 'pie') {
        options = {
          title: {
            text: chartInfo.chartTitle,
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}kg ({d}%)',
          },
          legend: {
            orient: 'horizontal',
            right: 10,
            top: 20,
          },
          series: [
            {
              name: '数据统计',
              type: 'pie',
              radius: '50%',
              center: ['50%', '60%'],
              data: chartInfo.data?.map((item: any) => {
                return {
                  value: item.quantity,
                  name: item.label,
                };
              }),
              label: {
                formatter: '{b}\n{c}t ({d}%)',
                position: 'outside',
                alignTo: 'edge',
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
      }
      else if (chartType === 'line') {
        const xAxisList = [] as string[];
        const dataList = [] as number[];
        let yUnit = '';
        chartInfo.data.forEach((item: any) => {
          xAxisList.push(item.month);
          dataList.push(item.quantity);
          yUnit = item.unit;
        });
        options = {
          title: {
            text: chartInfo.chartTitle,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: xAxisList,
          },
          yAxis: {
            type: 'value',
            name: yUnit,
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          series: [
            {
              type: chartType,
              data: dataList,
              itemStyle: {
                color: '#4B8BF5',
              },
            },
          ],
        };
      }
      else if (chartType === 'bar') {
        let year_2024 = [] as string[];
        let year_2025 = [] as string[];
        let yUnit = '';
        chartInfo.data.forEach((item: any) => {
          if (item.year === '2024') {
            year_2024 = item.quantity.map((q: any) => Number.parseFloat(q));
          }
          else if (item.year === '2025') {
            year_2025 = item.quantity.map((q: any) => Number.parseFloat(q));
          }
          yUnit = item.unit;
        });
        options = {
          title: {
            text: chartInfo.chartTitle,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          legend: {
            orient: 'horizontal',
            right: 10,
            top: 20,
          },
          xAxis: {
            type: 'category',
            // 1到12月
            data: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
          },
          yAxis: {
            type: 'value',
            name: yUnit,
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          series: [
            {
              type: chartType,
              data: year_2024,
              name: '2024年',
            },
            {
              type: chartType,
              data: year_2025,
              name: '2025年',
            },
          ],
        };
        console.log('options', options);
      }
      return (
        // <div style={{ margin: '8px 0', height: '400px', width: '100%' }}>
        <ReactECharts option={options} style={{ margin: '8px 0', height: '100%', width: '100%', minHeight: '300px' }} />
        // </div>
      );
    }
    catch (e) {
      console.error('解析 echarts 配置失败:', e);
      return (
        <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#fff2f0', color: '#cf1322', borderRadius: '4px' }}>
          图表配置解析失败,请检查语法是否正确
        </div>
      );
    }
  }
  return (
    <div style={{ margin: '8px 0', borderRadius: '4px', overflow: 'hidden' }}>
      <Flex
        justify="space-between"
        align="center"
        style={{ padding: '0 12px', backgroundColor: '#f5f7fa', borderBottom: '1px solid #e8eaed' }}
      >
        <span>{lang}</span>
        <Button size="small" type="link" onClick={() => copy(String(children))}>Copy</Button>
      </Flex>
      <SyntaxHighlighter
        style={github} // 可根据主题切换为 atelierHeathDark
        language={lang}
        PreTag="div"

        customStyle={{ padding: '8px' }}
      >
        {String(children)}
      </SyntaxHighlighter>
    </div>
  );
};

const Paragraph = (paragraph: any) => {
  const { node }: any = paragraph;
  const children_node = node.children;
  if (children_node && children_node[0] && 'tagName' in children_node[0] && children_node[0].tagName === 'img') {
    return (
      <>
        <ImageGallery srcs={[children_node[0].properties.src]} />
        {
          Array.isArray(paragraph.children) ? <p>{paragraph.children.slice(1)}</p> : null
        }
      </>
    );
  }
  return <p>{paragraph.children}</p>;
};

const Link = ({ node, ...props }: any) => {
  if (node.properties?.href && node.properties.href?.toString().startsWith('abbr')) {
    // const { onSend } = useChatContext()
    const hidden_text = decodeURIComponent(node.properties.href.toString().split('abbr:')[1]);

    return (
      <abbr
        className="cursor-pointer underline !decoration-primary-700 decoration-dashed"
        // onClick={() => onSend?.(hidden_text)}
        title={node.children[0]?.value}
      >
        {node.children[0]?.value}
      </abbr>
    );
  }
  else {
    return <a {...props} target="_blank" className="cursor-pointer underline !decoration-primary-700 decoration-dashed">{node.children[0] ? node.children[0]?.value : 'Download'}</a>;
  }
  // 链接鼠标移入时会tooltip显示网页信息
  // const _p = props;
  // return (
  //   <Tooltip
  //     title={node.properties?.href?.toString()}
  //   >
  //     {node.children[0]?.value}
  //   </Tooltip>
  // );
};

const Table = ({ children }: any) => (
  <table style={{
    borderCollapse: 'collapse',
    border: '1px solid #ccc',
    width: '100%',
  }}
  >
    {children}
  </table>
);

const TableHeader = ({ children }: any) => (
  <th style={{
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center',
  }}
  >
    {children}
  </th>
);

const TableCell = ({ children }: any) => (
  <td style={{
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center',
  }}
  >
    {children}
  </td>
);

const Markdown = memo((props: { content: string; className?: string; customDisallowedElements?: string[] }) => {
  const latexContent = flow([
    preprocessThinkTag,
    preprocessLaTeX,
  ])(props.content);

  return (
    <div className={props.className}>
      <ReactMarkdown
        remarkPlugins={[
          RemarkGfm,
          RemarkMath,
          RemarkBreaks,
        ]}
        rehypePlugins={[
          [RehypeKatex, { output: 'mathml' }],
          RehypeRaw as any,
          // The Rehype plug-in is used to remove the ref attribute of an element
          () => {
            return (tree) => {
              const iterate = (node: any) => {
                if (node.type === 'element' && node.properties?.ref)
                  delete node.properties.ref;

                if (node.type === 'element' && !/^[a-z][a-z0-9]*$/i.test(node.tagName)) {
                  node.type = 'text';
                  node.value = `<${node.tagName}`;
                }

                if (node.children)
                  node.children.forEach(iterate);
              };
              tree.children.forEach(iterate);
            };
          },
        ]}
        disallowedElements={['iframe', 'head', 'html', 'meta', 'link', 'style', 'body', ...(props.customDisallowedElements || [])]}
        components={{
          code: CodeBlock,
          a: Link,
          p: Paragraph,
          table: Table,
          th: TableHeader,
          td: TableCell,
          details: DetailsBlock,
          // button: MarkdownButton,
          // form: MarkdownForm,
          // script: ScriptBlock as any,
          // details: ThinkBlock,
        }}
      >
        {/* Markdown detect has problem. */}
        {latexContent}
      </ReactMarkdown>
    </div>
  );
});

export default Markdown;
