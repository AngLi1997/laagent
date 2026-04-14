import { Button, Tag } from 'ant-design-vue';
import type { TableColumn } from '../../index';

const names = ['王路飞', '王大蛇', '李白', '刺客伍六七'];

export const fetchStatusMapData = (keyword = '') => {
  const data = [
    {
      label: '已售罄',
      value: 0,
    },
    {
      label: '热卖中',
      value: 1,
    },
  ].filter(n => n.label.includes(keyword));
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

export const getClothesByGender = (gender: number) => {
  if (gender === 1) {
    // 男
    return [
      {
        label: '西装',
        value: 1,
      },
      {
        label: '领带',
        value: 0,
      },
    ];
  } else if (gender === 0) {
    //女
    return [
      {
        label: '裙子',
        value: 1,
      },
      {
        label: '包包',
        value: 0,
      },
    ];
  }
  return [];
};

export const tableData = Array.from({ length: 30 }).map((_, i) => {
  const gender = ~~(Math.random() * 2);
  return {
    id: i + 1,
    date: new Date().toLocaleString(),
    name: names[~~(Math.random() * 4)],
    clothes: getClothesByGender(gender)[~~(Math.random() * 2)].label,
    price: ~~(Math.random() * 1000),
    gender,
    status: ~~(Math.random() * 2),
  };
});

// 数据项类型
export type ListItemType = (typeof tableData)[number];
export const column: TableColumn[] = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'name',
    fixed: 'left',
    sorter: true,
    width: 300,

    hideInSearch: true,
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'gender',
    width: 100,

    hideInSearch: true,
    customRender: ({ record }) => ['女', '男'][record.gender],
  },
  {
    title: '衣服',
    align: 'center',
    dataIndex: 'clothes',
    hideInSearch: true,
  },
  {
    title: '价格',
    align: 'center',
    dataIndex: 'price',
    hideInSearch: true,
    customRender: ({ record }) => `${record.price}元`,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    hideInSearch: true,
    customRender: ({ record }) => (
      <Tag color={record.status == 1 ? 'red' : 'default'}>{['已售罄', '热卖中'][record.status]}</Tag>
    ),
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    hideInSearch: true,
    width: 200,

    customRender: ({ record }) => (
      <div>
        <Button type='link' onClick={() => console.log(record)}>
          编辑
        </Button>
        <Button type='link' onClick={() => console.log(record)}>
          删除
        </Button>
      </div>
    ),
  },
];

export const createSlotName = (name: string, index: number) => {
  return name + index;
};
