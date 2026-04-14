from langchain_core.runnables import RunnableConfig
from loguru import logger

from app import app
from app.core.agent.base_node import BmosNode, State
from app.core.agent.gragh.variable_parser import parse_variable, find_variable
from app.core.agent.knowledge.document.document import retrieval_chunks_with_kb_ids
from app.core.agent.messages.messages import DocumentLinkMessage
from app.models.document import DocumentRetrievalChunk
from app.models.graph_model import NodeInfo


class KBNode(BmosNode):

    def __init__(self, node_info: NodeInfo, chat_id):
        super().__init__(node_info, chat_id)

    def node(self, state: State, config: RunnableConfig):
        logger.info(f"【{self.node_info.node_name}】知识库节点开始运行...")
        inner_config = self.node_info.node_config.config
        variable_names = parse_variable(self.node_info.inputs[0].input_value)
        query_variable = find_variable(state.variables, variable_names[0])
        with app.app_context():
            chunks = retrieval_chunks_with_kb_ids([self.node_info.node_config.id], query_variable.value if query_variable else None , inner_config.matching_type, inner_config.top_k, inner_config.score_threshold, inner_config.rerank)
        variables = self._complete_put_output([chunk.content for chunk in chunks], self.node_info.outputs)
        messages = self.__build_messages(chunks)
        self._append_out_message(messages)
        logger.info(f"【{self.node_info.node_name}】知识库节点运行结束，messages={messages}")
        return {"messages": messages, "variables": variables}

    def __case(self, cases):
        pass

    def __build_messages(self, chunks: list[DocumentRetrievalChunk]) -> list[DocumentLinkMessage]:
        return [self._convertMessage(chunk) for chunk in chunks if self._convertMessage(chunk) is not None]

    def _convertMessage(self, chunk: DocumentRetrievalChunk) -> DocumentLinkMessage | None:
        return DocumentLinkMessage(node_id = self.node_info.node_id, content=chunk.content, knowledge_base_name=chunk.knowledge_base_name, document_name=chunk.document_name, document_url=chunk.document_source_url, document_id=chunk.document_id, document_chunk_id=chunk.chunk_id, document_chunk_content=chunk.content)
