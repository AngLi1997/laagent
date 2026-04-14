# -*- coding: utf-8 -*-
# @Time    : 2025/4/1 13:54
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm

"""mcp客户端 用于对接mcp工具"""

from contextlib import AsyncExitStack

from mcp import StdioServerParameters, stdio_client, ClientSession


class McpClient:

    def __init__(self, command, args, env):
        self.command = command
        self.args = args
        self.env = env
        self.exit_stack = AsyncExitStack()

    async def check_mcp_server(self) -> bool:
        """连接McpServer，并且将连接保存到属性session中"""
        sever_params = StdioServerParameters(
            command=self.command,
            args=self.args,
            env=self.env,
        )
        stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server=sever_params))
        stdio, write = stdio_transport
        session = await self.exit_stack.enter_async_context(ClientSession(stdio, write))
        try:
            await session.initialize()
            response = await session.list_tools()
            await self.exit_stack.aclose()
            if response.tools is None:
                return False
            return True
        except Exception as e:
            print(f"Error connecting to MCP server: {e}")
            return False