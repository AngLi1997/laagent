import React, { memo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import CodeHighlighter from "react-native-code-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { flow } from 'lodash-es';
import { markdownStyle } from './style';
import RightIcon from '@/assets/icons/right.svg';
import ThinkIcon from '@/assets/icons/ThinkIcon.svg';
import { t } from '@bmos/i18n';
import { Icon, Toast } from '@ant-design/react-native';
import { copyText } from '@/utils';

const preprocessThinkTag = (content: string) => {
  return content.replace(
    /<think>([\s\S]*?)(<\/think>|(?=$))/g,
    (_, innerContent, closingTag) => {
      const trimmedContent = innerContent.trim();
      return closingTag
        ? `\`\`\`think\n${trimmedContent}\n\`\`\``
        : `\`\`\`think\n${trimmedContent}\n\`\`\``;
    }
  );
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

const MarkdownRenderer: React.FC<{ content: string }> = memo(({ content }) => {
  const latexContent = flow([
    preprocessThinkTag,
    preprocessLaTeX,
  ])(content);

  const renderCodeBlock = (language: string, code: string) => {
    return (
      <View key={code} style={{ marginVertical: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc'}}>
        <View style={{
          padding: 8, 
          backgroundColor: '#f5f5f5', 
          borderBottomWidth: 1, 
          borderColor: '#ccc', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Text style={styles.text}>{language}</Text>
          <TouchableOpacity onPress={() => {copyText(code); Toast.show(t('复制成功'))}}>
            <Icon name="copy" size={16} color="rgb(22, 119, 255)" />
          </TouchableOpacity>
        </View>
        <CodeHighlighter
          hljsStyle={github}
          scrollViewProps={{contentContainerStyle: styles.codeContainer}}
          textStyle={styles.text}
          language={language}
        >
          {code.replace(/\n$/, '')}
        </CodeHighlighter>
      </View>
  )};

  const renderThinkBlock = (content: string) => {
    const [open, setOpen] = useState(true);
  
    const toggleOpen = () => {
      setOpen(prev => !prev);

    };
  
    return (
      <View key={content} style={{
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
      }}>
        <TouchableOpacity style={styles.summary} onPress={toggleOpen} activeOpacity={0.8}>
          <ThinkIcon width={20} height={20} />
          <Text style={styles.summaryText}>{t('深度思考')}</Text>
          {/* open时，图标旋转 */}
          <RightIcon
            width={14}
            height={14}
            style={{
              transform: [{ rotate: open ? '90deg' : '0deg' }],
              
            }} />
        </TouchableOpacity>
        {open && (
          <View style={styles.content}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        )}
      </View>
    );
  };

  const customRules = {
    fence: (node: any, children: any, parent: any, styles: any) => {
      const language = node.sourceInfo || '';
      if(language === 'think') {
        return renderThinkBlock(node.content);
      }
      try {
        const jsonChildren = JSON.parse(String(children));
        const { action, action_input } = jsonChildren;
        if (!action) {
          return renderCodeBlock(language, node.content);
        } else if (action === 'Final Answer') {
          // 如果 action 是 'Final Answer'，渲染指定样式
          return (
            <View style={styles.finalAnswerContainer}>
              <Text style={styles.finalAnswerText}>{String(action_input)}</Text>
            </View>
          );
        } else {
          // 如果 action 不匹配，返回 undefined
          return null;
        }

      } catch (e) {
        return renderCodeBlock(language, node.content);
      }
    },
    link: (node: any, children: any, parent: any, styles: any) => {
      console.log('link', node.attributes.href);
      return (
        <Text key={node.attributes.href} style={styles.link} onPress={() => console.log('link clicked', node.attributes.href)}>
          {children}
        </Text>
      );
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* @ts-ignore */}
      <Markdown
        // @ts-ignore
        style={markdownStyle}
        // @ts-ignore
        rules={customRules}
      >
        {latexContent}
      </Markdown>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  codeContainer: {
		padding: 16,
		minWidth: "100%",
    borderRadius: 8,
	},
	text: {
		fontSize: 16,
	},
  container: {
    flex: 1,
    minWidth: "100%",
    // marginBottom: 16,
  },
  finalAnswerContainer: {
    marginVertical: 8,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#e6f7ff',
  },
  finalAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0050b3',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    // flex: 1,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 21,
    color: '#242526',
  },
  content: {
    paddingTop: 4,
  },
  contentText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});


export default MarkdownRenderer;