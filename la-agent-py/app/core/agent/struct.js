let node = {
    node_id: 'node_1',
    // 不允许含有"."
    node_name: "节点名称",
    // 节点类型 start end llm kb condition tool
    node_type: "llm",
    // 节点配置 llm_config kb_config tool_config
    node_config: {

    },
    // 变量节点 obj
    // 默认内置变量名 input 其他地方可以使用${节点名称.input调用}
    inputs: [
        {
            // 输入变量名 添加后在其他地方可以使用
            param_name: "search_key",
            // 输入变量类型 string number bool variable_selector input
            input_type: "variable_selector",
            // 输入变量值 后续可以使用变量 ${本节点名称.search_key}，且取值与${开始节点.input}相同
            // 为input时不需要这个字段
            input_value: "${开始节点.input}"
        }
    ],
    // 节点输出 可以传递给下个节点的参数 obj
    // 默认变量名 output 其他地方可以使用${节点名称.output}调用
    outputs: [
        {
            // 输入变量名 添加后在其他地方可以使用
            param_name: "search_key",
            // 输入变量类型 string number bool variable_selector input
            input_type: "variable_selector",
            // 输入变量值 后续可以使用变量 ${本节点名称.search_key}，且取值与${开始节点.input}相同
            // 为input时不需要这个字段
            input_value: "${开始节点.input}"
        }
    ],
    // bool 是否输出到用户 为true则可以在聊天的时候将(node_output.output)内容响应返回给前端
    output_to_user: true,
    // 异常处理方式
    error_handle: {
        // str terminal 终止, continue 继续
        type: "terminal",
        terminal_message: '不走了',
        outputs: [
            {
                // 输入变量名 添加后在其他地方可以使用
                param_name: "search_key",
                // 输入变量类型 string number bool variable_selector input
                input_type: "variable_selector",
                // 输入变量值 后续可以使用变量 ${本节点名称.search_key}，且取值与${开始节点.input}相同
                // 为input时不需要这个字段
                input_value: "${开始节点.input}"
            }
        ]
    },
    // 节点样式
    styles: ''
}

// 模型节点
let llm_config = {
    // 模型id
    id: "llm_id",
    // 模型参数 可以没有 没有就从默认配置取值
    config: {
        // 温度
        temperature: 0.5,
        top_k: 0,
        top_p: 1,
        // 后面可能会有其他配置
    },
    // 提示词 默认一个system的 可以动态添加
    prompts: [
        {
            "type": "system",
            "prompt": `你是一个知识库检索搜索助手${节点名称.input}`
        }, {
            "type": "human",
            "prompt": "${节点名称.input}"
        }
    ]
}

// 知识库节点
let kb_config = {
    // 知识库id
    id: "kb_id",
    // 知识库配置
    config: {
        // 匹配模式 VECTOR 向量 | FUZZY 模糊匹配
        matching_type: 'VECTOR',
        // 匹配数量
        top_k: 5,
        // 召回阈值
        score_threshold: 0.4,
        // 是否重新排序
        rerank: false,
    }
}

// 工具节点
let tool_config = {
    id: "tool_id",
    config: {
        // tool参数 (动态)
        tool_params: [
            {
                // 参数名称
                name: 'a',
                // 参数类型 string number bool
                type: 'string',
                // 参数值
                value: '${节点名称.input}',
                // 参数值类型 string number bool variable_selector
                value_type: 'variable_selector'
            }
        ],
        // 工具参数 类似需要token授权的工具
        settings: [
            {
                // 设置名称
                name: 'token_api',
                // 设置类型 string number bool
                type: 'string',
                // 设置值
                value: '这是GoogleSearch的ApiToken'
            }
        ]
    }
}

// 条件节点
let condition_config = {
    cases: [
        {
            // 条件id 前端生成
            id: 'case_1',
            // 含有 condition属性 即为 if / elseif 分支
            conditions: [
                {
                    // 单条件id
                    id: 'A',
                    // 变量选择器
                    variable_selector: "${env.a}",
                    // 条件操作符 ["is","not","contains", "not_contains", "is_null", "not_null"]
                    operator: "is",
                    // 值
                    value: "1",
                    // 值类型 string number bool variable_selector
                    value_type: "number"
                },
                {
                    id: 'B',
                    variable_selector: "${节点名称.input}",
                    operator: "is",
                    value: "2",
                    value_type: "number"
                }
            ],
            // 条件和条件之间的关系 此处代表 a=1 or a=2
            logic: "A&&(B||C)"
        }, {
            // 没有condition 默认就是 else 分支
            id: 'case_2'
        }
    ]
}

let edge = {
    // 边id
    id: 'edge_1',
    // 来源节点
    from_node: 'llm_1',
    // 到达节点
    to_node: 'node_2',
    // 如果from为条件节点 则需要指定分支条件id
    from_case: 'case_1',
    // 边样式
    styles: ''
}


// agent graph整体配置

let graph = {
    // 节点列表
    nodes: [],
    // 边列表
    edges: [],

    // 环境变量
    envs: [
        {
            // 环境变量id 前端生成id
            id: 'env_1',
            // 环境变量名称
            name: 'company_name',
            // 环境变量类型 string number bool
            type: 'string',
            // 环境变量值
            value: '佰墨思'
        }
    ]
}