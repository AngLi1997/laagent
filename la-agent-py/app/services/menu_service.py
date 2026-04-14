from __future__ import annotations

from dataclasses import dataclass

from app.entities.menu import BaMenu
from app.models.menu import MenuNode


@dataclass(frozen=True)
class MenuSeed:
    menu_key: str
    name: str
    menu_type: str
    parent_menu_key: str | None = None
    path: str | None = None
    component: str | None = None
    icon: str | None = None
    sort_no: int = 0
    terminal_type: int = 1
    is_outside: int = 0
    hidden: int = 0
    enabled: int = 1
    remark: str | None = None


MENU_SEEDS: list[MenuSeed] = [
    MenuSeed(menu_key='230', name='管理后台', menu_type='ROOT', sort_no=1),
    MenuSeed(menu_key='230010', parent_menu_key='230', name='基础数据', menu_type='MENU', icon='AreaManagement', path='/BasicData', sort_no=10),
    MenuSeed(menu_key='230010001', parent_menu_key='230010', name='模型配置', menu_type='PAGE', path='/BasicData/ModelConfig', component='@/pages/BasicData/ModelConfig/index.vue', sort_no=1),
    MenuSeed(menu_key='230010001000001', parent_menu_key='230010001', name='测试', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230010001000002', parent_menu_key='230010001', name='数据权限', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230010002', parent_menu_key='230010', name='工具配置', menu_type='PAGE', path='/BasicData/ToolConfig', component='@/pages/BasicData/ToolConfig/index.vue', sort_no=2),
    MenuSeed(menu_key='230010002000001', parent_menu_key='230010002', name='新增工具', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230010002000002', parent_menu_key='230010002', name='编辑', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230010002000003', parent_menu_key='230010002', name='查看', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230010002000004', parent_menu_key='230010002', name='数据权限', menu_type='FUNC', sort_no=4),
    MenuSeed(menu_key='230010002000005', parent_menu_key='230010002', name='删除', menu_type='FUNC', sort_no=5),
    MenuSeed(menu_key='230020', parent_menu_key='230', name='知识库管理', menu_type='MENU', icon='DataInstrument', path='/documentManage', sort_no=20),
    MenuSeed(menu_key='230020001', parent_menu_key='230020', name='文档管理', menu_type='PAGE', path='/documentManage/document', component='@/pages/DocumentManage/Document/index.vue', sort_no=1),
    MenuSeed(menu_key='230020001000001', parent_menu_key='230020001', name='新增子分类', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230020001000002', parent_menu_key='230020001', name='编辑分类', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230020001000003', parent_menu_key='230020001', name='删除分类', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230020001000004', parent_menu_key='230020001', name='新增文档', menu_type='FUNC', sort_no=4),
    MenuSeed(menu_key='230020001000005', parent_menu_key='230020001', name='编辑', menu_type='FUNC', sort_no=5),
    MenuSeed(menu_key='230020001000006', parent_menu_key='230020001', name='查看', menu_type='FUNC', sort_no=6),
    MenuSeed(menu_key='230020001000007', parent_menu_key='230020001', name='数据权限', menu_type='FUNC', sort_no=7),
    MenuSeed(menu_key='230020001000008', parent_menu_key='230020001', name='删除', menu_type='FUNC', sort_no=8),
    MenuSeed(menu_key='230020001000009', parent_menu_key='230020001', name='启停', menu_type='FUNC', sort_no=9),
    MenuSeed(menu_key='230020002', parent_menu_key='230020', name='知识库管理', menu_type='PAGE', path='/documentManage/knowledgeBase', component='@/pages/DocumentManage/KnowledgeBase/index.vue', sort_no=2),
    MenuSeed(menu_key='230020002000001', parent_menu_key='230020002', name='新增子分类', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230020002000002', parent_menu_key='230020002', name='编辑分类', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230020002000003', parent_menu_key='230020002', name='删除分类', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230020002000004', parent_menu_key='230020002', name='新增知识库', menu_type='FUNC', sort_no=4),
    MenuSeed(menu_key='230020002000005', parent_menu_key='230020002', name='编辑', menu_type='FUNC', sort_no=5),
    MenuSeed(menu_key='230020002000006', parent_menu_key='230020002', name='查看', menu_type='FUNC', sort_no=6),
    MenuSeed(menu_key='230020002000007', parent_menu_key='230020002', name='召回测试', menu_type='FUNC', sort_no=7),
    MenuSeed(menu_key='230020002000008', parent_menu_key='230020002', name='数据权限', menu_type='FUNC', sort_no=8),
    MenuSeed(menu_key='230020002000009', parent_menu_key='230020002', name='删除', menu_type='FUNC', sort_no=9),
    MenuSeed(menu_key='230020002000010', parent_menu_key='230020002', name='启停', menu_type='FUNC', sort_no=10),
    MenuSeed(menu_key='230030', parent_menu_key='230', name='智能体管理', menu_type='MENU', icon='AreaManagement', path='/AgentManage', sort_no=30),
    MenuSeed(menu_key='230030001', parent_menu_key='230030', name='Agent 编排', menu_type='PAGE', path='/AgentManage/Orchestration', component='@/pages/AgentManage/Orchestration/index.vue', sort_no=1),
    MenuSeed(menu_key='230030001000001', parent_menu_key='230030001', name='新增子分类', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230030001000002', parent_menu_key='230030001', name='编辑分类', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230030001000003', parent_menu_key='230030001', name='删除分类', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230030001000004', parent_menu_key='230030001', name='新增应用', menu_type='FUNC', sort_no=4),
    MenuSeed(menu_key='230030001000005', parent_menu_key='230030001', name='编辑/编排', menu_type='FUNC', sort_no=5),
    MenuSeed(menu_key='230030001000006', parent_menu_key='230030001', name='查看', menu_type='FUNC', sort_no=6),
    MenuSeed(menu_key='230030001000007', parent_menu_key='230030001', name='数据权限', menu_type='FUNC', sort_no=7),
    MenuSeed(menu_key='230030001000008', parent_menu_key='230030001', name='调试', menu_type='FUNC', sort_no=8),
    MenuSeed(menu_key='230030001000009', parent_menu_key='230030001', name='发布', menu_type='FUNC', sort_no=9),
    MenuSeed(menu_key='230030001000010', parent_menu_key='230030001', name='删除', menu_type='FUNC', sort_no=10),
    MenuSeed(menu_key='230030001000011', parent_menu_key='230030001', name='启停', menu_type='FUNC', sort_no=11),
    MenuSeed(menu_key='230040', parent_menu_key='230', name='服务监控', menu_type='MENU', icon='AreaManagement', path='/ServiceMonitoring', sort_no=40),
    MenuSeed(menu_key='230040001', parent_menu_key='230040', name='内容审查', menu_type='PAGE', path='/ServiceMonitoring/ContentReview', component='@/pages/ServiceMonitoring/ContentReview/index.vue', sort_no=1),
    MenuSeed(menu_key='230040001000001', parent_menu_key='230040001', name='创建词组', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230040001000002', parent_menu_key='230040001', name='编辑', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230040001000003', parent_menu_key='230040001', name='查看', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230040001000004', parent_menu_key='230040001', name='拦截记录', menu_type='FUNC', sort_no=4),
    MenuSeed(menu_key='230040001000005', parent_menu_key='230040001', name='删除', menu_type='FUNC', sort_no=5),
    MenuSeed(menu_key='230040001000006', parent_menu_key='230040001', name='启停', menu_type='FUNC', sort_no=6),
    MenuSeed(menu_key='230040002', parent_menu_key='230040', name='标记调优', menu_type='PAGE', path='/ServiceMonitoring/TagTuning', component='@/pages/ServiceMonitoring/TagTuning/index.vue', sort_no=2),
    MenuSeed(menu_key='230040002000001', parent_menu_key='230040002', name='标注', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230040002000002', parent_menu_key='230040002', name='下发', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230040002000003', parent_menu_key='230040002', name='对话详情', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230040002000004', parent_menu_key='230040002', name='删除', menu_type='FUNC', sort_no=4, enabled=0, remark='前端当前已注释，保留预留权限位'),
    MenuSeed(menu_key='230040003', parent_menu_key='230040', name='问题靶场', menu_type='PAGE', path='/ServiceMonitoring/QuestionShootRange', component='@/pages/ServiceMonitoring/QuestionShootRange/index.vue', sort_no=3),
    MenuSeed(menu_key='230040003000001', parent_menu_key='230040003', name='创建问题', menu_type='FUNC', sort_no=1),
    MenuSeed(menu_key='230040003000002', parent_menu_key='230040003', name='编辑', menu_type='FUNC', sort_no=2),
    MenuSeed(menu_key='230040003000003', parent_menu_key='230040003', name='删除', menu_type='FUNC', sort_no=3),
    MenuSeed(menu_key='230040004', parent_menu_key='230040', name='对话日志', menu_type='PAGE', path='/ServiceMonitoring/ChatLog', component='@/pages/ServiceMonitoring/ChatLog/index.vue', sort_no=4),
    MenuSeed(menu_key='230040004000001', parent_menu_key='230040004', name='对话详情', menu_type='FUNC', sort_no=1),
]


def bootstrap_menus(db_session):
    existing = {item.menu_key: item for item in BaMenu.query.execution_options(include_deleted=True).all()}
    for index, seed in enumerate(MENU_SEEDS, start=1):
        record = existing.get(seed.menu_key)
        if record is None:
            record = BaMenu(menu_key=seed.menu_key)
            db_session.add(record)
        record.code = index
        record.parent_menu_key = seed.parent_menu_key
        record.name = seed.name
        record.menu_type = seed.menu_type
        record.path = seed.path
        record.component = seed.component
        record.icon = seed.icon
        record.sort_no = seed.sort_no
        record.terminal_type = seed.terminal_type
        record.is_outside = seed.is_outside
        record.hidden = seed.hidden
        record.enabled = seed.enabled
        record.remark = seed.remark


def _is_true(value: str | bool | None) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def _build_node(record: BaMenu, children: list[MenuNode]) -> MenuNode:
    return MenuNode(
        id=record.menu_key,
        code=record.code,
        parentId=record.parent_menu_key,
        name=record.name,
        menuType=record.menu_type,
        path=record.path,
        component=record.component,
        icon=record.icon,
        sortNo=record.sort_no,
        terminalType=record.terminal_type,
        isOutside=record.is_outside,
        hidden=record.hidden,
        children=children,
    )


def _resolve_root(records: list[BaMenu], root_menu_code: str | None) -> str | None:
    if not records:
        return None
    if not root_menu_code:
        return '230' if any(item.menu_key == '230' for item in records) else records[0].menu_key
    target = str(root_menu_code)
    for item in records:
        if item.menu_key == target or str(item.code) == target:
            return item.menu_key
    return target


def query_menu_tree(*, root_menu_code: str | None = None, contains_func: str | bool | None = None, terminal_type: int | None = None) -> list[MenuNode]:
    query = BaMenu.query.filter(BaMenu.enabled == 1)
    if terminal_type is not None:
        query = query.filter(BaMenu.terminal_type == terminal_type)

    records = query.order_by(BaMenu.code.asc()).all()
    if not records:
        return []

    include_func = _is_true(contains_func)
    root_key = _resolve_root(records, root_menu_code)
    children_map: dict[str | None, list[BaMenu]] = {}
    record_map = {item.menu_key: item for item in records}

    for item in records:
        if item.menu_type == 'FUNC' and not include_func:
            continue
        if root_key and item.menu_key != root_key and root_key not in _ancestor_keys(item, record_map):
            continue
        children_map.setdefault(item.parent_menu_key, []).append(item)

    for item_children in children_map.values():
        item_children.sort(key=lambda item: (item.sort_no, item.code))

    def build(menu_key: str) -> MenuNode | None:
        record = record_map.get(menu_key)
        if record is None:
            return None
        child_nodes = []
        for child in children_map.get(menu_key, []):
            node = build(child.menu_key)
            if node is not None:
                child_nodes.append(node)
        return _build_node(record, child_nodes)

    roots = children_map.get(None, [])
    if root_key:
        root_node = build(root_key)
        return [root_node] if root_node else []
    return [node for item in roots if (node := build(item.menu_key)) is not None]


def _ancestor_keys(record: BaMenu, record_map: dict[str, BaMenu]) -> set[str]:
    ancestor_keys: set[str] = set()
    parent_key = record.parent_menu_key
    while parent_key:
        ancestor_keys.add(parent_key)
        parent = record_map.get(parent_key)
        if parent is None or parent.parent_menu_key == parent_key:
            break
        parent_key = parent.parent_menu_key
    return ancestor_keys
