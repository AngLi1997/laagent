
declare namespace API {
    interface Data<T> {
        code: number;
        data: T;
        message: string;
    }

    /** /api/app/platform/dept/assign-person */
    interface PlatformDeptAssignPersonReq {
        /** 部门id */
        deptId?: number;
        /** 查询字样 */
        name?: string;
    }

    /** 数据内容 */
    interface PlatformDeptAssignPersonRes {
        /** */
        loginName?: string;
        /** */
        name?: string;
        /** */
        userId?: string;
        /** */
        userName?: string;
    }

    /** /api/app/platform/dept/delete */
    type PlatformDeptDeleteReq = integer;
    /** */
    type PlatformDeptDeleteRes = string;
    /** 数据内容 */
    type PlatformDeptGetDeptListRes = array;

    /** /api/app/platform/dept/relate-user-data */
    interface PlatformDeptRelateUserDataReq {
        /** 部门id */
        deptId?: number;
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 用户名称 */
        userName?: string;
    }

    /** 数据内容 */
    type PlatformDeptRelateUserDataRes = string;
    /** /api/app/platform/dept/relate-user-del */
    type PlatformDeptRelateUserDelReq = integer;
    /** */
    type PlatformDeptRelateUserDelRes = string;
    /** /api/app/platform/dept/relate-user-delAll */
    type PlatformDeptRelateUserDelAllReq = integer;
    /** */
    type PlatformDeptRelateUserDelAllRes = string;
    /** /api/app/platform/dept/relate-user-save */
    type PlatformDeptRelateUserSaveReq = Array<PlatformDeptRelateUserSaveReqVo>;
    /** */
    type PlatformDeptRelateUserSaveRes = string;

    /** /api/app/platform/dept/save */
    interface PlatformDeptSaveReq {
        /** 部门名称 */
        deptName?: string;
        /** 上级部门编码 */
        parentCode?: string;
        /** 上级部门id */
        parentId?: number;
        /** 备注 */
        remark?: string;
    }

    /** */
    type PlatformDeptSaveRes = string;

    /** 数据内容 */
    interface PlatformDeptTreeAllRes {
        /** 子数据 */
        children?: Array<PlatformDeptTreeAllResChildrenVo>;
        /** 编码 */
        code?: string;
        /** 创建时间 */
        createTime?: string;
        /** id */
        id?: number;
        /** 部门名称 */
        name?: string;
        /** 父级编码 */
        parentCode?: string;
        /** 父级id */
        parentId?: number;
        /** 父级部门名称 */
        parentName?: string;
        /** 备注 */
        remark?: string;
    }

    /** /api/app/platform/dept/tree-assigned */
    interface PlatformDeptTreeAssignedReq {
        /** name */
        name?: string;
        /** deptId */
        deptId: number;
    }

    /** 数据内容 */
    interface PlatformDeptTreeAssignedRes {
        /** */
        loginName?: string;
        /** */
        name?: string;
        /** */
        userId?: string;
        /** */
        userName?: string;
    }

    /** /api/app/platform/dept/tree-unassigned */
    interface PlatformDeptTreeUnassignedReq {
        /** name */
        name?: string;
    }

    /** 数据内容 */
    type PlatformDeptTreeUnassignedRes = string;

    /** /api/app/platform/dept/update */
    interface PlatformDeptUpdateReq {
        /** 部门名称 */
        deptName?: string;
        /** id */
        id?: number;
        /** 备注 */
        remark?: string;
    }

    /** */
    type PlatformDeptUpdateRes = string;

    /** /api/app/platform/dept/validate-dept */
    interface PlatformDeptValidateDeptReq {
        /** deptName */
        deptName: string;
        /** id */
        id?: number;
    }

    /** 数据内容 */
    type PlatformDeptValidateDeptRes = boolean;
    /** /api/app/platform/menu/delete */
    type PlatformMenuDeleteReq = integer;
    /** */
    type PlatformMenuDeleteRes = string;

    /** /api/app/platform/menu/function */
    interface PlatformMenuFunctionReq {
        /** menuId */
        menuId: number;
        /** roleId */
        roleId: number;
    }

    /** 数据内容 */
    interface PlatformMenuFunctionRes {
        /** 是否被选中 */
        flag?: boolean;
        /** id */
        id?: number;
        /** 功能名称 */
        name?: string;
        /** 父级id */
        parentId?: string;
    }

    /** /api/app/platform/menu/relate-role-data */
    interface PlatformMenuRelateRoleDataReq {
        /** menuId */
        menuId: number;
    }

    /** 数据内容 */
    type PlatformMenuRelateRoleDataRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/menu/save */
    interface PlatformMenuSaveReq {
        /** 是否是菜单 */
        isMenu?: number;
        /** 菜单名称 */
        name?: string;
        /** 上级id */
        parentId?: number;
        /** 排序号 */
        sort?: number;
    }

    /** 数据内容 */
    interface PlatformMenuSaveRes {
        /** id */
        id?: number;
        /** 是否是菜单 */
        isMenu?: boolean;
        /** 菜单名称 */
        name?: string;
        /** 父级id */
        parentId?: number;
        /** 排序号 */
        sort?: string;
        /** 终端类型 */
        type?: number;
    }

    /** /api/app/platform/menu/tree-all */
    interface PlatformMenuTreeAllReq {
        /** name */
        name?: string;
        /** typeId */
        typeId?: number;
    }

    /** 数据内容 */
    interface PlatformMenuTreeAllRes {
        /** 子数据 */
        children?: Array<PlatformMenuTreeAllResChildrenVo>;
        /** id */
        id?: number;
        /** 是否是菜单 */
        isMenu?: number;
        /** 菜单名称 */
        name?: string;
        /** 父级id */
        parentId?: number;
        /** 父级菜单名称 */
        parentName?: string;
        /** 排序 */
        sort?: number;
    }

    /** /api/app/platform/menu/tree-permission */
    interface PlatformMenuTreePermissionReq {
        /** 模糊查询字段 */
        name?: string;
        /** 终端类型id */
        typeId: number;
    }

    /** 数据内容 */
    type PlatformMenuTreePermissionRes = PlatformMenuTreeAllRes;

    /** /api/app/platform/menu/type */
    interface PlatformMenuTypeReq {
        /** type */
        type?: number;
    }

    /** 数据内容 */
    interface PlatformMenuTypeRes {
        /** id */
        id?: number;
        /** TAB名称 */
        terminalName?: string;
    }

    /** /api/app/platform/menu/update */
    interface PlatformMenuUpdateReq {
        /** id */
        id?: number;
        /** 是否是菜单 */
        isMenu?: number;
        /** 菜单名称 */
        name?: string;
        /** 上级id */
        parentId?: string;
        /** 排序号 */
        sort?: number;
    }

    /** */
    type PlatformMenuUpdateRes = string;
    /** /api/app/platform/role/delete-role */
    type PlatformRoleDeleteRoleReq = integer;
    /** */
    type PlatformRoleDeleteRoleRes = string;
    /** /api/app/platform/role/delete-type */
    type PlatformRoleDeleteTypeReq = integer;
    /** */
    type PlatformRoleDeleteTypeRes = string;

    /** /api/app/platform/role/get-role */
    interface PlatformRoleGetRoleReq {
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 角色名称 */
        roleName?: string;
        /** 角色类型id */
        roleTypeId?: number;
    }

    /** 数据内容 */
    type PlatformRoleGetRoleRes = string;
    /** 数据内容 */
    type PlatformRoleGetRoleListRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/role/relate-menu-data */
    interface PlatformRoleRelateMenuDataReq {
        /** roleId */
        roleId: number;
    }

    /** 数据内容 */
    type PlatformRoleRelateMenuDataRes = PlatformDeptGetDeptListRes;
    /** /api/app/platform/role/relate-menu-save */
    type PlatformRoleRelateMenuSaveReq = Array<PlatformRoleRelateMenuSaveReqVo>;
    /** */
    type PlatformRoleRelateMenuSaveRes = string;

    /** /api/app/platform/role/relate-user-save */
    interface PlatformRoleRelateUserSaveReq {
        /** 子数据的集合 */
        items?: Array<PlatformRoleRelateUserSaveReqItemsVo>;
        /** 角色id */
        roleId?: number;
    }

    /** */
    type PlatformRoleRelateUserSaveRes = string;

    /** /api/app/platform/role/role-tree-all */
    interface PlatformRoleRoleTreeAllReq {
        /** menuId */
        menuId?: number;
    }

    /** 数据内容 */
    interface PlatformRoleRoleTreeAllRes {
        /** 子数据 */
        children?: Array<PlatformRoleRoleTreeAllResChildrenVo>;
        /** */
        createTime?: string;
        /** 是否有子结构 */
        flag?: boolean;
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 父级id */
        parentId?: number;
        /** 父级角色类型名称 */
        parentName?: string;
        /** 角色数据集合 */
        roleList?: Array<PlatformRoleRoleTreeAllResRoleListVo>;
        /** 角色类型名称 */
        roleTypeName?: string;
    }

    /** /api/app/platform/role/save-role */
    interface PlatformRoleSaveRoleReq {
        /** 描述 */
        description?: string;
        /** 角色名称 */
        roleName?: string;
        /** 角色分类id */
        roleTypeId?: number;
    }

    /** */
    type PlatformRoleSaveRoleRes = string;

    /** /api/app/platform/role/save-type */
    interface PlatformRoleSaveTypeReq {
        /** 父级id */
        parentId?: number;
        /** 角色分类名称 */
        roleTypeName?: string;
    }

    /** */
    type PlatformRoleSaveTypeRes = string;

    /** /api/app/platform/role/tree-all */
    interface PlatformRoleTreeAllReq {
        /** name */
        name?: string;
    }

    /** 数据内容 */
    type PlatformRoleTreeAllRes = PlatformRoleRoleTreeAllRes;

    /** /api/app/platform/role/update-role */
    interface PlatformRoleUpdateRoleReq {
        /** 描述 */
        description?: string;
        /** 角色名称id */
        id?: number;
        /** 角色名称 */
        roleName?: string;
        /** 角色分类id */
        roleTypeId?: number;
    }

    /** */
    type PlatformRoleUpdateRoleRes = string;

    /** /api/app/platform/role/update-type */
    interface PlatformRoleUpdateTypeReq {
        /** 角色类型id */
        id?: number;
        /** 角色类型名称 */
        roleTypeName?: string;
    }

    /** */
    type PlatformRoleUpdateTypeRes = string;

    /** /api/app/platform/role/validate-role */
    interface PlatformRoleValidateRoleReq {
        /** roleName */
        roleName: string;
        /** id */
        id?: number;
    }

    /** 数据内容 */
    type PlatformRoleValidateRoleRes = boolean;

    /** /api/app/platform/role/validate-roleType */
    interface PlatformRoleValidateRoleTypeReq {
        /** roleTypeName */
        roleTypeName: string;
        /** id */
        id?: number;
    }

    /** 数据内容 */
    type PlatformRoleValidateRoleTypeRes = boolean;

    /** /api/app/platform/user/login */
    interface PlatformUserLoginReq {
        /** 账号 */
        loginName?: string;
        /** 密码 */
        password?: string;
        /**
         * 服务类型
         * [MES:MES]
         */
        serviceType?: string;
        /**
         * 终端类型
         * [0:pc,
         * 1:pad]
         */
        terminalType?: number;
    }

    /** 数据内容 */
    type PlatformUserLoginRes = string;

    /** /api/app/platform/user/page */
    interface PlatformUserPageReq {
        /** 排序 */
        dir?: string;
        /** 性别 */
        gender?: number;
        /** id */
        id?: number;
        /** 用户账号（模糊查询） */
        loginName?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 手机号（模糊查询） */
        phone?: string;
        /** 启停 */
        state?: number;
        /** 状态 */
        status?: number;
        /** 用户名称（模糊查询） */
        userName?: string;
    }

    /** 数据内容 */
    type PlatformUserPageRes = string;

    /** /api/app/platform/user/permission */
    interface PlatformUserPermissionReq {
        /** userId */
        userId: string;
        /** menuId */
        menuId?: number;
    }

    /** 数据内容 */
    type PlatformUserPermissionRes = PlatformMenuSaveRes;

    /** /api/app/platform/user/relate-dept-data */
    interface PlatformUserRelateDeptDataReq {
        /** userId */
        userId: string;
    }

    /** 数据内容 */
    type PlatformUserRelateDeptDataRes = PlatformDeptGetDeptListRes;
    /** /api/app/platform/user/relate-dept-save */
    type PlatformUserRelateDeptSaveReq = Array<PlatformUserRelateDeptSaveReqVo>;
    /** */
    type PlatformUserRelateDeptSaveRes = string;

    /** /api/app/platform/user/relate-role-data */
    interface PlatformUserRelateRoleDataReq {
        /** userId */
        userId: string;
    }

    /** 数据内容 */
    type PlatformUserRelateRoleDataRes = PlatformDeptGetDeptListRes;
    /** /api/app/platform/user/relate-role-save */
    type PlatformUserRelateRoleSaveReq = Array<PlatformUserRelateRoleSaveReqVo>;
    /** */
    type PlatformUserRelateRoleSaveRes = string;

    /** /api/app/platform/user/save */
    interface PlatformUserSaveReq {
        /** 邮箱 */
        email?: string;
        /** 性别 */
        gender?: number;
        /** 用户账号 */
        loginName?: string;
        /** 密码 */
        password?: string;
        /** 手机号 */
        phone?: string;
        /** 备注 */
        remark?: string;
        /** 用户名称 */
        userName?: string;
    }

    /** */
    type PlatformUserSaveRes = string;

    /** /api/app/platform/user/start */
    interface PlatformUserStartReq {
        /** id */
        id?: number;
        /** 启用状态 */
        state?: number;
        /** 用户id */
        userId?: string;
    }

    /** */
    type PlatformUserStartRes = string;

    /** /api/app/platform/user/update */
    interface PlatformUserUpdateReq {
        /** 邮箱 */
        email?: string;
        /** 性别 */
        gender?: number;
        /** id */
        id?: number;
        /** 用户账号 */
        loginName?: string;
        /** 密码 */
        password?: string;
        /** 手机号 */
        phone?: string;
        /** 备注 */
        remark?: string;
        /** 解锁状态 */
        status?: number;
        /** 用户名称 */
        userName?: string;
    }

    /** */
    type PlatformUserUpdateRes = string;

    /** /api/app/platform/user/validate-user */
    interface PlatformUserValidateUserReq {
        /** userName */
        userName: string;
    }

    /** 数据内容 */
    type PlatformUserValidateUserRes = boolean;
    /** /api/app/platform/menu/relate-role-save */
    type PlatformMenuRelateRoleSaveReq = Array<PlatformMenuRelateRoleSaveReqVo>;
    /** */
    type PlatformMenuRelateRoleSaveRes = string;

    /** /api/app/platform/material/category/save */
    interface MaterialCategorySaveReq {
        /** 编码 */
        code: string;
        /** 名称 */
        name: string;
        /** 父级id */
        parentId?: number;
    }

    /** 数据内容 */
    type MaterialCategorySaveRes = number;

    /** 数据内容 */
    interface MaterialCategoryTreeRes {
        /** 子节点 */
        children?: Array<MaterialCategoryTreeResChildrenVo>;
        /** 编码 */
        code?: string;
        /** 创建时间 */
        createTime?: string;
        /** id */
        id?: number;
        /** 合并编码 */
        mergeCode?: string;
        /** 名称 */
        name?: string;
        /** 父节点 */
        parentId?: number;
        /** 展示名:编码-名称 */
        showName?: string;
    }

    /** /api/app/platform/material/category/update */
    interface MaterialCategoryUpdateReq {
        /** 编码 */
        code: string;
        /** id */
        id: number;
        /** 名称 */
        name: string;
    }

    /** */
    type MaterialCategoryUpdateRes = string;

    /** /api/app/platform/material/changeStatus */
    interface PlatformMaterialChangeStatusReq {
        /** id */
        id: number;
        /**
         * 启停
         * [true:启用,
         * false:停用]
         */
        status: boolean;
    }

    /** */
    type PlatformMaterialChangeStatusRes = string;

    /** /api/app/platform/material/detail */
    interface PlatformMaterialDetailReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type PlatformMaterialDetailRes = string;

    /** /api/app/platform/material/page */
    interface PlatformMaterialPageReq {
        /** 编码 */
        code?: string;
        /** 排序 */
        dir?: string;
        /** 物料分类id */
        materialCategoryId?: number;
        /** */
        materialCategoryIds?: array;
        /** 合并编码 */
        mergeCode?: string;
        /** 名称 */
        name?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type PlatformMaterialPageRes = string;

    /** /api/app/platform/material/principal/list */
    interface MaterialPrincipalListReq {
        /** 物料分类id */
        materialCategoryId: number;
    }

    /** 数据内容 */
    interface MaterialPrincipalListRes {
        /** 编码 */
        code?: string;
        /** id */
        id?: number;
        /** 合并编码 */
        mergeCode?: string;
        /** 名称 */
        name?: string;
    }

    /** /api/app/platform/material/save */
    interface PlatformMaterialSaveReq {
        /** 业务名称 */
        businessName?: string;
        /** 业务注册 */
        businessRegister?: boolean;
        /** 编码 */
        code: string;
        /** 物料分类id */
        materialCategoryId: number;
        /** 名称 */
        name: string;
        /** 所属物料id */
        principalMaterialId?: number;
        /** 备注 */
        remark?: string;
        /** 编码 */
        specification: string;
        /** 是否是主要物料 */
        subMaterial: boolean;
        /** 单位id */
        unitId: number;
    }

    /** 数据内容 */
    type PlatformMaterialSaveRes = number;

    /** /api/app/platform/material/update */
    interface PlatformMaterialUpdateReq {
        /** 分类编码 */
        categoryCode: string;
        /** 编码 */
        code: string;
        /** id */
        id: number;
        /** 物料分类id */
        materialCategoryId: number;
        /** 名称 */
        name: string;
        /** 所属物料id */
        principalMaterialId?: number;
        /** 备注 */
        remark?: string;
        /** 编码 */
        specification: string;
        /** 是否是主要物料 */
        subMaterial: boolean;
        /** 单位id */
        unitId: number;
    }

    /** */
    type PlatformMaterialUpdateRes = string;
    /** */
    type CategoryDeleteByIdRes = string;
    /** */
    type MaterialDeleteByIdRes = string;

    /** /api/app/platform/role/relate-user-data */
    interface PlatformRoleRelateUserDataReq {
        /** roleId */
        roleId: number;
    }

    /** 数据内容 */
    interface PlatformRoleRelateUserDataRes {
        /** 子数据 */
        children?: Array<PlatformRoleRelateUserDataResChildrenVo>;
        /** 编码 */
        code?: string;
        /** 创建时间 */
        createTime?: string;
        /** 是否是部门 */
        deptFlag?: boolean;
        /** id */
        id?: string;
        /** 用户账号 */
        loginName?: string;
        /** 部门或人名称 */
        name?: string;
        /** 父级id */
        parentId?: string;
        /** 父级部门名称 */
        parentName?: string;
        /** 备注 */
        remark?: string;
    }

    /** /api/app/platform/unit/delete/unit */
    interface UnitDeleteUnitReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type UnitDeleteUnitRes = boolean;

    /** /api/app/platform/unit/delete/unit/extend */
    interface DeleteUnitExtendReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type DeleteUnitExtendRes = boolean;

    /** 数据内容 */
    interface ListDownBoxRes {
        /** 标准单位id */
        unitId?: number;
        /** 单位名称 */
        unitName?: string;
    }

    /** /api/app/platform/unit/list/unit */
    interface UnitListUnitReq {
        /** 排序 */
        dir?: string;
        /** 标准单位id */
        id?: number;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 单位名称 */
        unitName?: string;
    }

    /** 数据内容 */
    type UnitListUnitRes = string;

    /** /api/app/platform/unit/list/unit/extend */
    interface ListUnitExtendReq {
        /** 排序 */
        dir?: string;
        /** 标准单位id */
        id?: number;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 单位名称 */
        unitName?: string;
    }

    /** 数据内容 */
    type ListUnitExtendRes = string;

    /** /api/app/platform/unit/save/unit */
    interface UnitSaveUnitReq {
        /** 备注 */
        remark?: string;
        /** 修约Code */
        roundCode?: string;
        /** 单位名称 */
        unitName?: string;
        /** 精度 */
        unitPrecision?: number;
    }

    /** 数据内容 */
    type UnitSaveUnitRes = boolean;

    /** /api/app/platform/unit/save/unit/extend */
    interface SaveUnitExtendReq {
        /** 表达式值 */
        expressionValue?: string;
        /** 扩展单位精度 */
        extendPrecision?: number;
        /** 扩展单位名称 */
        extendUnitName?: string;
        /** 备注 */
        remark?: string;
        /** 标准单位id */
        unitId?: number;
    }

    /** 数据内容 */
    type SaveUnitExtendRes = boolean;

    /** /api/app/platform/unit/update/unit */
    interface UnitUpdateUnitReq {
        /** 标准单位id */
        id?: number;
        /** 备注 */
        remark?: string;
        /** 修约规则Code */
        roundCode?: string;
        /**
         * 启停
         * [true:启用,
         * false:停用]
         */
        state: boolean;
        /** 标准单位名称 */
        unitName?: string;
        /** 精度 */
        unitPrecision?: number;
    }

    /** 数据内容 */
    type UnitUpdateUnitRes = boolean;

    /** /api/app/platform/unit/update/unit/extend */
    interface UpdateUnitExtendReq {
        /** 表达式值 */
        expressionValue?: string;
        /** 扩展单位精度 */
        extendPrecision?: number;
        /** 扩展单位名称 */
        extendUnitName?: string;
        /** 扩展单位id */
        id?: number;
        /** 备注 */
        remark?: string;
        /**
         * 启停
         * [true:启用,
         * false:停用]
         */
        state: boolean;
        /** 标准单位id */
        unitId?: number;
    }

    /** 数据内容 */
    type UpdateUnitExtendRes = boolean;

    /** /api/app/platform/unit/watch/unit */
    interface UnitWatchUnitReq {
        /** id */
        id: number;
    }

    /** */
    type UnitWatchUnitRes = string;

    /** /api/app/platform/unit/watch/unit/extend */
    interface WatchUnitExtendReq {
        /** id */
        id: number;
    }

    /** */
    type WatchUnitExtendRes = string;
    /** */
    type CategoryDeleteByIdRes = string;

    /** /api/app/platform/expression/category/save */
    interface ExpressionCategorySaveReq {
        /** 名称 */
        name: string;
        /** 父级id */
        parentId?: number;
    }

    /** */
    type ExpressionCategorySaveRes = string;

    /** 数据内容 */
    interface ExpressionCategoryTreeRes {
        /** 子节点 */
        children?: Array<ExpressionCategoryTreeResChildrenVo>;
        /** 创建时间 */
        createTime?: string;
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 父节点 */
        parentId?: number;
    }

    /** /api/app/platform/expression/category/update */
    interface ExpressionCategoryUpdateReq {
        /** 父级id */
        id: number;
        /** 名称 */
        name: string;
        /** 父级id */
        parentId: number;
    }

    /** */
    type ExpressionCategoryUpdateRes = string;
    /** */
    type ExpressionConfirmByIdRes = string;
    /** */
    type ExpressionDeleteByIdRes = string;

    /** 数据内容 */
    interface PlatformExpressionListRes {
        /** 确认状态 */
        confirmStatus?: string;
        /** 公式表达式 */
        expression?: string;
        /** 分类id */
        expressionCategoryId?: number;
        /** 分类名称 */
        expressionCategoryName?: string;
        /** 公式表达式解析结果 */
        expressionParse?: Array<PlatformExpressionListResExpressionParseVo>;
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 计算结果 */
        result?: string;
    }

    /** /api/app/platform/expression/page */
    interface PlatformExpressionPageReq {
        /** 排序 */
        dir?: string;
        /** 物料分类id */
        expressionCategoryId?: number;
        /** 物料分类id */
        expressionCategoryIds?: array;
        /** 名称 */
        name?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type PlatformExpressionPageRes = string;

    /** /api/app/platform/expression/save */
    interface PlatformExpressionSaveReq {
        /** 公式表达式 */
        expression: string;
        /** 分类id */
        expressionCategoryId: number;
        /** 公式表达式解析结果 */
        expressionParse: Array<PlatformExpressionSaveReqExpressionParseVo>;
        /** 名称 */
        name: string;
        /** 计算结果 */
        result: string;
    }

    /** */
    type PlatformExpressionSaveRes = string;

    /** /api/app/platform/expression/update */
    interface PlatformExpressionUpdateReq {
        /** 公式表达式 */
        expression: string;
        /** 公式表达式解析结果 */
        expressionParse: Array<PlatformExpressionUpdateReqExpressionParseVo>;
        /** id */
        id: number;
        /** 名称 */
        name: string;
        /** 计算结果 */
        result: string;
    }

    /** */
    type PlatformExpressionUpdateRes = string;

    /** /api/app/platform/material/category/existed/{code} */
    interface CategoryExistedByCodeReq {
        /** code */
        code: string;
    }

    /** 数据内容 */
    type CategoryExistedByCodeRes = boolean;

    /** /api/app/platform/material/existed */
    interface PlatformMaterialExistedReq {
        /** code */
        code: string;
        /** platformMaterialId */
        platformMaterialId?: number;
    }

    /** 数据内容 */
    type PlatformMaterialExistedRes = boolean;

    /** /api/app/platform/expression/parse */
    interface PlatformExpressionParseReq {
        /** 表达式 */
        expression: string;
    }

    /** 数据内容 */
    type PlatformExpressionParseRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/business/parameter/page */
    interface BusinessParameterPageReq {
        /** 所属应用 */
        belong?: string;
        /** */
        businessType?: string;
        /** 编码 */
        code?: string;
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** */
        valueType?: string;
    }

    /** 数据内容 */
    type BusinessParameterPageRes = string;

    /** /api/app/platform/business/parameter/detail/{id} */
    interface ParameterDetailByIdReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type ParameterDetailByIdRes = string;
    /** */
    type BusinessParameterRefreshRes = string;

    /** /api/app/platform/business/parameter/update */
    interface BusinessParameterUpdateReq {
        /** 描述 */
        description?: string;
        /** 编码 */
        id?: number;
        /** 值 */
        value?: string;
    }

    /** */
    type BusinessParameterUpdateRes = string;
    /** */
    type PlatformUserLogoutRes = string;
    /** */
    type PlatformUserLogoutRes = string;
    /** */
    type PlatformUserExportRes = string;
    /** */
    type PlatformUserImportRes = string;

    /** /api/app/platform/expression/parse/{expression} */
    interface ExpressionParseByExpressionReq {
        /** expression */
        expression: string;
    }

    /** 数据内容 */
    type ExpressionParseByExpressionRes = PlatformDeptGetDeptListRes;

    /** 数据内容 */
    interface AdminRootListRes {
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
    }

    /** /api/app/platform/menu/role/save */
    interface MenuRoleSaveReq {
        /** 菜单id */
        menuIds?: Array<number>;
        /** 菜单id 集合 */
        roleIds?: Array<number>;
    }

    /** */
    type MenuRoleSaveRes = string;
    /** 数据内容 */
    type MenuRootListRes = AdminRootListRes;

    /** /api/app/platform/role/menu/save */
    interface RoleMenuSaveReq {
        /** 菜单集合 */
        items?: Array<RoleMenuSaveReqItemsVo>;
        /** 角色id */
        roleId?: number;
    }

    /** */
    type RoleMenuSaveRes = string;
    /** 数据内容 */
    type PlatformUserStatusRes = string;

    /** /api/app/platform/menu/auth/tree */
    interface MenuAuthTreeReq {
        /** containsFunc */
        containsFunc?: string;
        /** rootMenuCode */
        rootMenuCode?: string;
        /** */
        terminalType?: number;
    }

    /** 数据内容 */
    type MenuAuthTreeRes = PlatformMenuTreeAllRes;

    /** 数据内容 */
    interface PlatformDeptTreeRes {
        /** */
        children?: Array<PlatformDeptTreeResChildrenVo>;
        /** */
        createTime?: string;
        /** */
        id?: number;
        /** */
        name?: string;
        /** */
        parentId?: number;
    }

    /** /api/app/platform/dept/user/tree */
    interface DeptUserTreeReq {
        /** parentDeptCode */
        parentDeptCode?: string;
    }

    /** 数据内容 */
    type DeptUserTreeRes = PlatformRoleRelateUserDataRes;

    /** /api/app/platform/menu/admin/tree */
    interface MenuAdminTreeReq {
        /** rootMenuCode */
        rootMenuCode?: string;
    }

    /** 数据内容 */
    type MenuAdminTreeRes = PlatformMenuTreeAllRes;

    /** /api/app/platform/material/category/existed */
    interface MaterialCategoryExistedReq {
        /** code */
        code: string;
        /** id */
        id?: number;
    }

    /** 数据内容 */
    type MaterialCategoryExistedRes = boolean;

    /** /api/app/platform/material/issue */
    interface PlatformMaterialIssueReq {
        /** 物料下发业务 */
        businesses?: Array<PlatformMaterialIssueReqBusinessesVo>;
        /** 物料分类ids */
        materialCategoryIds?: Array<number>;
        /** 物料ids */
        materialIds?: Array<number>;
    }

    /** */
    type PlatformMaterialIssueRes = string;

    /** /api/app/platform/user/list */
    interface PlatformUserListReq {
        /** */
        state?: number;
    }

    /** 数据内容 */
    interface PlatformUserListRes {
        /** */
        userId?: string;
        /** */
        userName?: string;
    }

    /** 数据内容 */
    type PlatformRoleMineRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/user/changePassword */
    interface PlatformUserChangePasswordReq {
        /** 密码 */
        password: string;
    }

    /** */
    type PlatformUserChangePasswordRes = string;

    /** /api/app/platform/user/resetPassword */
    interface PlatformUserResetPasswordReq {
        /** 新密码 */
        password?: string;
        /** 用户id */
        userId?: string;
    }

    /** */
    type PlatformUserResetPasswordRes = string;

    /** /api/app/platform/user/validatePassword */
    interface PlatformUserValidatePasswordReq {
        /** 密码 */
        password?: string;
    }

    /** */
    type PlatformUserValidatePasswordRes = string;

    /** /api/app/platform/material/category/issueTree */
    interface MaterialCategoryIssueTreeReq {
        /** parentId */
        parentId: number;
        /** keyword */
        keyword?: string;
    }

    /** 数据内容 */
    interface MaterialCategoryIssueTreeRes {
        /** 是否为分类节点 */
        categoryFlag?: boolean;
        /** 子集 */
        children?: Array<MaterialCategoryIssueTreeResChildrenVo>;
        /** 编码 */
        code?: string;
        /** id */
        id?: number;
        /** 合并编码 */
        mergeCode?: string;
        /** 名称 */
        name?: string;
        /** 父级id */
        parentId?: number;
    }

    /** /api/app/platform/user/changePwd */
    type PlatformUserChangePwdReq = PlatformUserChangePasswordReq;
    /** */
    type PlatformUserChangePwdRes = string;

    /** 数据内容 */
    interface PlatformMaterialIssueBusinessesRes {
        /** 子业务列表 */
        children?: Array<PlatformMaterialIssueBusinessesResChildrenVo>;
        /** 业务平台名称 */
        platformName?: string;
    }

    /** /api/app/platform/codeRuleVersion/page */
    interface PlatformCodeRuleVersionPageReq {
        /** 规则编码 */
        code?: string;
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type PlatformCodeRuleVersionPageRes = string;

    /** /api/app/platform/dept/remove/user */
    interface DeptRemoveUserReq {
        /** 部门id */
        deptId: number;
        /** 用户id */
        userId: string;
    }

    /** */
    type DeptRemoveUserRes = string;

    /** /api/app/platform/dict/delete/dict */
    interface DictDeleteDictReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type DictDeleteDictRes = boolean;

    /** /api/app/platform/dict/delete/dict/detail */
    interface DeleteDictDetailReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type DeleteDictDetailRes = boolean;

    /** /api/app/platform/dict/list/dict */
    interface DictListDictReq {
        /** 字典编码 */
        dictCode?: string;
        /** 字典名称 */
        dictName?: string;
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type DictListDictRes = string;

    /** /api/app/platform/dict/list/dict/detail */
    interface ListDictDetailReq {
        /** 字典id */
        dictId: number;
        /** 数据标签 */
        dictLabel?: string;
        /** 数据值 */
        dictValue?: string;
        /** 排序 */
        dir?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type ListDictDetailRes = string;

    /** /api/app/platform/dict/list/dict/down */
    interface ListDictDownReq {
        /** dictId */
        dictId?: number;
    }

    /** 数据内容 */
    interface ListDictDownRes {
        /** id */
        id?: number;
        /** 标签 */
        label?: string;
        /** 值 */
        value?: string;
    }

    /** /api/app/platform/dict/save/dict */
    interface DictSaveDictReq {
        /** 字典数据集合 */
        detailList?: Array<DictSaveDictReqDetailListVo>;
        /** 字典编码 */
        dictCode?: string;
        /** 字典名称 */
        dictName?: string;
    }

    /** 数据内容 */
    type DictSaveDictRes = boolean;

    /** /api/app/platform/dict/save/dict/detail */
    interface SaveDictDetailReq {
        /** 字典表id */
        dictId?: number;
        /** 数据标签 */
        dictLabel?: string;
        /** 数据值 */
        dictValue?: string;
    }

    /** 数据内容 */
    type SaveDictDetailRes = boolean;

    /** /api/app/platform/dict/update/dict */
    interface DictUpdateDictReq {
        /** 字典详情数据 */
        detailList?: Array<DictUpdateDictReqDetailListVo>;
        /** 字典编码 */
        dictCode?: string;
        /** 字典名称 */
        dictName?: string;
        /** 字典id */
        id?: number;
    }

    /** 数据内容 */
    type DictUpdateDictRes = boolean;

    /** /api/app/platform/dict/update/dict/detail */
    interface UpdateDictDetailReq {
        /** 字典id */
        dictId?: number;
        /** 数据标签 */
        dictLabel?: string;
        /** 数据值 */
        dictValue?: string;
        /** id */
        id?: number;
    }

    /** 数据内容 */
    type UpdateDictDetailRes = boolean;

    /** /api/app/platform/dict/watch/dict */
    interface DictWatchDictReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type DictWatchDictRes = string;

    /** /api/app/platform/dict/watch/dict/detail */
    interface WatchDictDetailReq {
        /** id */
        id: number;
    }

    /** */
    type WatchDictDetailRes = string;

    /** 数据内容 */
    interface RoleAggregateTreeRes {
        /** 子节点 */
        children?: Array<RoleAggregateTreeResChildrenVo>;
        /** 创建时间 */
        createTime?: string;
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 父节点id */
        parentId?: number;
        /** 是否是角色类型，true为是 */
        roleTypeFlag?: boolean;
    }

    /** */
    type CodeRuleVersionConfirmByIdRes = string;
    /** */
    type CodeRuleVersionDeleteByIdRes = string;
    /** */
    type CodeRuleVersionDisabledByIdRes = string;
    /** */
    type CodeRuleVersionEnabledByIdRes = string;

    /** /api/app/platform/material/syncList */
    interface PlatformMaterialSyncListReq {
        /** 物料分类ids */
        materialCategoryIds?: Array<number>;
        /** 物料ids */
        materialIds?: Array<number>;
    }

    /** 数据内容 */
    type PlatformMaterialSyncListRes = string;

    /** /api/app/platform/menu/auth/menu/tree */
    interface AuthMenuTreeReq {
        /** rootMenuCode */
        rootMenuCode?: string;
    }

    /** 数据内容 */
    type AuthMenuTreeRes = PlatformMenuTreeAllRes;
    /** /api/app/platform/menu/auth/role/save */
    type AuthRoleSaveReq = MenuRoleSaveReq;
    /** */
    type AuthRoleSaveRes = string;

    /** /api/app/platform/role/auth/role/tree */
    interface AuthRoleTreeReq {
        /** menuId */
        menuId: number;
    }

    /** 数据内容 */
    type AuthRoleTreeRes = RoleAggregateTreeRes;

    /** /api/app/platform/business/parameter/detailByCode/{code} */
    interface ParameterDetailByCodeByCodeReq {
        /** code */
        code: string;
    }

    /** 数据内容 */
    type ParameterDetailByCodeByCodeRes = string;

    /** /api/app/platform/role/auth/list */
    interface RoleAuthListReq {
        /** menuId */
        menuId: number;
    }

    /** 数据内容 */
    type RoleAuthListRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/role/menu/id */
    interface RoleMenuIdReq {
        /** roleId */
        roleId: number;
    }

    /** 数据内容 */
    interface RoleMenuIdRes {
        /** */
        menuIds?: Array<number>;
        /** */
        rootMenuId?: number;
    }

    /** /api/app/platform/business/parameter/detail/{code} */
    interface ParameterDetailByCodeReq {
        /** code */
        code: string;
    }

    /** 数据内容 */
    type ParameterDetailByCodeRes = string;

    /** /api/app/platform/unit/list/unitAndExtend */
    interface UnitListUnitAndExtendReq {
        /** 拓展单位ids */
        unitExtendIds?: Array<number>;
        /** 单位ids */
        unitIds?: Array<number>;
    }

    /** 数据内容 */
    type UnitListUnitAndExtendRes = string;

    /** 数据内容 */
    interface UnitListRoundingRes {
        /** */
        label?: string;
        /** */
        value?: string;
    }

    /** /api/app/platform/unit/update/extend/state */
    type UpdateExtendStateReq = UpdateUnitExtendReq;
    /** 数据内容 */
    type UpdateExtendStateRes = boolean;
    /** 数据内容 */
    type PlatformDeptIdRes = PlatformDeptGetDeptListRes;
    /** 数据内容 */
    type PlatformRoleIdRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/codeRule/batchConfirmNo */
    interface PlatformCodeRuleBatchConfirmNoReq {
        /** 编码规则code */
        code?: string;
        /** 公式申请时的日期 -- 规则中没有日期字段可不传 */
        codeApplyTime?: string;
        /** 编码规则详情传参 */
        fields?: object;
        /** 完整标号 */
        fullNos?: Array<string>;
    }

    /** */
    type PlatformCodeRuleBatchConfirmNoRes = string;

    /** /api/app/platform/codeRule/confirmNo */
    interface PlatformCodeRuleConfirmNoReq {
        /** 编码规则code */
        code?: string;
        /** 公式申请时的日期 -- 规则中没有日期字段可不传 */
        codeApplyTime?: string;
        /** 编码规则详情传参 */
        fields?: object;
        /** 完整标号 */
        fullNo?: string;
    }

    /** */
    type PlatformCodeRuleConfirmNoRes = string;

    /** /api/app/platform/codeRule/detail/{id} */
    interface CodeRuleDetailByIdReq {
        /** id */
        id: number;
    }

    /** 数据内容 */
    type CodeRuleDetailByIdRes = string;

    /** /api/app/platform/codeRule/getBatchNextUseNo */
    interface PlatformCodeRuleGetBatchNextUseNoReq {
        /** 编码规则code */
        code?: string;
        /** 编码规则详情传参 */
        fields?: object;
        /** 生成数量 */
        num?: number;
    }

    /** 数据内容 */
    type PlatformCodeRuleGetBatchNextUseNoRes = string;

    /** /api/app/platform/codeRule/getNextNo */
    interface PlatformCodeRuleGetNextNoReq {
        /** 编码规则code */
        code?: string;
        /** 编码规则详情传参 */
        fields?: object;
    }

    /** 数据内容 */
    type PlatformCodeRuleGetNextNoRes = string;
    /** /api/app/platform/codeRule/getNextUseNo */
    type PlatformCodeRuleGetNextUseNoReq = PlatformCodeRuleGetNextNoReq;
    /** 数据内容 */
    type PlatformCodeRuleGetNextUseNoRes = string;

    /** /api/app/platform/codeRule/page */
    interface PlatformCodeRulePageReq {
        /** 编码 */
        code?: string;
        /** 部门Id */
        deptIds?: array;
        /** 排序 */
        dir?: string;
        /** 名称 */
        name?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
    }

    /** 数据内容 */
    type PlatformCodeRulePageRes = string;

    /** /api/app/platform/codeRule/permission */
    interface PlatformCodeRulePermissionReq {
        /** 编码规则ID */
        codeRuleId: number;
        /** deptIds */
        deptIds: Array<number>;
    }

    /** */
    type PlatformCodeRulePermissionRes = string;
    /** 数据内容 */
    type PermissionDetailByIdRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/codeRule/save */
    interface PlatformCodeRuleSaveReq {
        /** 规则编码 */
        code: string;
        /** 规则信息 */
        codeRuleVersionDetails: Array<PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo>;
        /** 版本描述 */
        description: string;
        /** 数据字典id */
        dictId: number;
        /** 规则名称 */
        name: string;
        /** 重置规则 */
        resetRule?: Array<number>;
        /** 版本号 */
        version: string;
    }

    /** */
    type PlatformCodeRuleSaveRes = string;

    /** /api/app/platform/codeRule/update */
    interface PlatformCodeRuleUpdateReq {
        /** 规则信息 */
        codeRuleVersionDetails: Array<PlatformCodeRuleUpdateReqCodeRuleVersionDetailsVo>;
        /** 版本描述 */
        description: string;
        /** 数据字典id */
        dictId: number;
        /** id */
        id: number;
        /** 重置规则 */
        resetRule?: Array<number>;
        /** 版本号 */
        version: string;
        /** 版本id */
        versionId: number;
    }

    /** */
    type PlatformCodeRuleUpdateRes = string;
    /** 数据内容 */
    type DeptPartitionTreeRes = PlatformDeptTreeRes;

    /** /api/app/platform/codeRuleVersion/save */
    interface PlatformCodeRuleVersionSaveReq {
        /** 规则编码 */
        code: string;
        /** 规则信息 */
        codeRuleVersionDetails: Array<PlatformCodeRuleVersionSaveReqCodeRuleVersionDetailsVo>;
        /** 版本描述 */
        description: string;
        /** 数据字典id */
        dictId: number;
        /** 重置规则 */
        resetRule?: Array<number>;
        /** 版本号 */
        version: string;
    }

    /** */
    type PlatformCodeRuleVersionSaveRes = string;

    /** /api/app/platform/codeRuleVersion/update */
    interface PlatformCodeRuleVersionUpdateReq {
        /** 规则信息 */
        codeRuleVersionDetails: Array<PlatformCodeRuleVersionUpdateReqCodeRuleVersionDetailsVo>;
        /** 版本描述 */
        description: string;
        /** 数据字典id */
        dictId: number;
        /** 重置规则 */
        resetRule?: Array<number>;
        /** 版本号 */
        version: string;
        /** 版本Id */
        versionId: number;
    }

    /** */
    type PlatformCodeRuleVersionUpdateRes = string;
    /** 数据内容 */
    type DeptMineIdRes = PlatformDeptGetDeptListRes;

    /** /api/app/platform/codeRule/list */
    interface PlatformCodeRuleListReq {
        /** 编码 */
        code?: string;
        /** 名称 */
        status?: string;
    }

    /** 数据内容 */
    interface PlatformCodeRuleListRes {
        /** 编码 */
        code?: string;
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 启用版本 */
        version?: string;
    }

    /** /api/app/platform/log/export */
    interface PlatformLogExportReq {
        /** 结束时间 */
        endTime?: string;
        /** 账号 */
        loginName?: string;
        /** 已选择的id列表 */
        selectIds?: array;
        /** 开始时间 */
        startTime?: string;
        /** 用户名 */
        userName?: string;
    }

    /** */
    type PlatformLogExportRes = string;

    /** /api/app/platform/log/page */
    interface PlatformLogPageReq {
        /** 排序 */
        dir?: string;
        /** 结束时间 */
        endTime?: string;
        /** 账号 */
        loginName?: string;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 开始时间 */
        startTime?: string;
        /** 用户名 */
        userName?: string;
    }

    /** 数据内容 */
    interface PlatformLogPageRes {
        /** */
        description?: string;
        /** */
        descriptionCode?: number;
        /** */
        ip?: string;
        /** */
        loginName?: string;
        /** */
        operationAction?: string;
        /** */
        operationState?: boolean;
        /** */
        operationTime?: string;
        /** */
        userName?: string;
    }

    /** 数据内容 */
    interface PlatformRoleListRes {
        /** 描述 */
        description?: string;
        /** id */
        id?: number;
        /** 角色名称 */
        roleName?: string;
        /** 角色类型id */
        roleTypeId?: string;
    }

    /** /api/app/platform/user/{userId} */
    interface PlatformUserByUserIdReq {
        /** userId */
        userId: string;
    }

    /** 数据内容 */
    type PlatformUserByUserIdRes = string;

    /** /api/app/platform/dict/list/dict/code */
    interface ListDictCodeReq {
        /** code */
        code: string;
    }

    /** 数据内容 */
    type ListDictCodeRes = ListDictDownRes;

    /** /api/app/platform/log/login/export */
    interface LogLoginExportReq {
        /** 结束时间 */
        endTime?: string;
        /** 账号 */
        loginName?: string;
        /** 已选择的id列表 */
        selectIds?: array;
        /** 开始时间 */
        startTime?: string;
        /** 用户名 */
        userName?: string;
    }

    /** */
    type LogLoginExportRes = string;
    /** /api/app/platform/log/login/page */
    type LogLoginPageReq = PlatformLogPageReq;
    /** 数据内容 */
    type LogLoginPageRes = string;

    /** /api/app/platform/log/operation/log */
    interface LogOperationLogReq {
        /** 排序 */
        dir?: string;
        /** 结束时间 */
        endTime?: string;
        /** */
        menuId?: number;
        /**
         * 操作类型
         * [0:新增,
         * 1:编辑,
         * 2:删除,
         * 3:导出,
         * 4:关联,
         * 5:审核]
         */
        operationType?: number;
        /** 排序 */
        orderBy?: string;
        /** 页码，从 1 开始 */
        pageNum: number;
        /** 每页条数，最大值为 100 */
        pageSize: number;
        /** 开始时间 */
        startTime?: string;
        /** 操作人 */
        userName?: string;
    }

    /** 数据内容 */
    type LogOperationLogRes = string;

    /** PlatformDeptRelateUserSaveReqVo */
    interface PlatformDeptRelateUserSaveReqVo {
        /** 部门id */
        deptId?: number;
        /** 用户id */
        userId?: string;
    }

    /** PlatformDeptTreeAllResChildrenVo */
    type PlatformDeptTreeAllResChildrenVo = PlatformDeptTreeAllRes;
    /** PlatformMenuTreeAllResChildrenVo */
    type PlatformMenuTreeAllResChildrenVo = PlatformMenuTreeAllRes;

    /** PlatformRoleRelateMenuSaveReqVo */
    interface PlatformRoleRelateMenuSaveReqVo {
        /** 子数据的集合 */
        items?: Array<MenuRoleSaveReq>;
        /** 角色id */
        roleId?: number;
        /** tab的id */
        tabId?: number;
    }

    /** PlatformRoleRelateUserSaveReqItemsVo */
    interface PlatformRoleRelateUserSaveReqItemsVo {
        /** 角色id */
        roleId?: number;
        /** 用户id */
        userId?: string;
    }

    /** PlatformRoleRoleTreeAllResChildrenVo */
    type PlatformRoleRoleTreeAllResChildrenVo = PlatformRoleRoleTreeAllRes;

    /** PlatformRoleRoleTreeAllResRoleListVo */
    interface PlatformRoleRoleTreeAllResRoleListVo {
        /** id */
        id?: number;
        /** 名称 */
        name?: string;
        /** 角色名称 */
        roleName?: string;
        /** 角色类型id */
        roleTypeId?: number;
    }

    /** PlatformUserRelateDeptSaveReqVo */
    type PlatformUserRelateDeptSaveReqVo = PlatformDeptRelateUserSaveReqVo;
    /** PlatformUserRelateRoleSaveReqVo */
    type PlatformUserRelateRoleSaveReqVo = PlatformRoleRelateUserSaveReqItemsVo;
    /** PlatformMenuRelateRoleSaveReqVo */
    type PlatformMenuRelateRoleSaveReqVo = MenuRoleSaveReq;
    /** MaterialCategoryTreeResChildrenVo */
    type MaterialCategoryTreeResChildrenVo = MaterialCategoryTreeRes;
    /** PlatformRoleRelateUserDataResChildrenVo */
    type PlatformRoleRelateUserDataResChildrenVo = PlatformRoleRelateUserDataRes;
    /** ExpressionCategoryTreeResChildrenVo */
    type ExpressionCategoryTreeResChildrenVo = ExpressionCategoryTreeRes;

    /** PlatformExpressionListResExpressionParseVo */
    interface PlatformExpressionListResExpressionParseVo {
        /** */
        key?: string;
        /** */
        value?: string;
    }

    /** PlatformExpressionSaveReqExpressionParseVo */
    type PlatformExpressionSaveReqExpressionParseVo = PlatformExpressionListResExpressionParseVo;
    /** PlatformExpressionUpdateReqExpressionParseVo */
    type PlatformExpressionUpdateReqExpressionParseVo = PlatformExpressionListResExpressionParseVo;

    /** RoleMenuSaveReqItemsVo */
    interface RoleMenuSaveReqItemsVo {
        /** 菜单集合 */
        menuIds?: Array<number>;
        /** 角色id */
        rootMenuId?: number;
    }

    /** PlatformDeptTreeResChildrenVo */
    type PlatformDeptTreeResChildrenVo = PlatformDeptTreeRes;

    /** PlatformMaterialIssueReqBusinessesVo */
    interface PlatformMaterialIssueReqBusinessesVo {
        /** 业务平台子业务码 */
        childCodeList?: Array<number>;
        /** 业务平台名称 */
        platformName?: string;
    }

    /** MaterialCategoryIssueTreeResChildrenVo */
    type MaterialCategoryIssueTreeResChildrenVo = MaterialCategoryIssueTreeRes;

    /** PlatformMaterialIssueBusinessesResChildrenVo */
    interface PlatformMaterialIssueBusinessesResChildrenVo {
        /** 子业务码 */
        childCode?: number;
        /** 子业务名称 */
        childName?: string;
    }

    /** DictSaveDictReqDetailListVo */
    type DictSaveDictReqDetailListVo = SaveDictDetailReq;
    /** DictUpdateDictReqDetailListVo */
    type DictUpdateDictReqDetailListVo = UpdateDictDetailReq;
    /** RoleAggregateTreeResChildrenVo */
    type RoleAggregateTreeResChildrenVo = RoleAggregateTreeRes;

    /** PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo */
    interface PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo {
        /** 日期格式 yyyyMMdd yyyy-MM-dd yyyy/MM/dd 类似此格式 */
        dateFormat?: string;
        /** 日期类型前端展示数字 年月等 */
        dateType?: string;
        /** 是否补零 TRUE FALSE */
        fillZero?: string;
        /** 最大长度 */
        maxLength?: number;
        /** 参数id */
        parameterId?: number;
        /** 排序 */
        sort: number;
        /** 开始编号 */
        startNo?: number;
        /** 步长 */
        step?: number;
        /** 类型 常量 CONSTANT 参数 PARAMETER 日期 DATE 流水号 SEQUENCE */
        type: string;
        /** 值 类型为常量使用 */
        value?: string;
    }

    /** PlatformCodeRuleUpdateReqCodeRuleVersionDetailsVo */
    type PlatformCodeRuleUpdateReqCodeRuleVersionDetailsVo = PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo;
    /** PlatformCodeRuleVersionSaveReqCodeRuleVersionDetailsVo */
    type PlatformCodeRuleVersionSaveReqCodeRuleVersionDetailsVo = PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo;
    /** PlatformCodeRuleVersionUpdateReqCodeRuleVersionDetailsVo */
    type PlatformCodeRuleVersionUpdateReqCodeRuleVersionDetailsVo = PlatformCodeRuleSaveReqCodeRuleVersionDetailsVo;
}

