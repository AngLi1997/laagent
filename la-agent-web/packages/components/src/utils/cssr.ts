/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { plugin as BemPlugin } from '@css-render/plugin-bem';
import { CNodeChildren, CssRender, type CNode, type CProperties } from 'css-render';
import { useClsPrefix } from '../hooks/useConfig';

const namespace = 'ant';
const prefix = `.${namespace}-`;
const elementPrefix = '-';
const modifierPrefix = '-';

const cssr = CssRender();
const plugin = BemPlugin({
  blockPrefix: prefix,
  elementPrefix,
  modifierPrefix,
});
cssr.use(plugin);
const { c, find } = cssr;
const { cB, cE, cM, cNotM } = plugin;

function insideModal(style: CNode): CNode {
  return c(({ props: { bPrefix } }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style]);
}

function insidePopover(style: CNode): CNode {
  return c(({ props: { bPrefix } }) => `${bPrefix || prefix}popover`, [style]);
}

function asModal(style: CProperties): CNode {
  return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}modal`, style);
}

function asBrother(name: string, style?: CProperties, children?: CNodeChildren): CNode {
  if (style) {
    if (children) {
      return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}${name}`, style, children);
    }
    return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}${name}`, style);
  } else if (children) {
    return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}${name}`, children);
  }
  return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}${name}`, style || children || undefined);
}

function asMultipleClass(names: string[], style: CProperties): CNode {
  return c(({ props: { bPrefix } }) => {
    return names.map(name => `${bPrefix || prefix}${name}`).join('');
  }, style);
}
function asMultiplePrefixClass(
  names: Array<{
    hasPrefix: boolean;
    name: string;
  }>,
  style: CProperties,
): CNode {
  return c(({ props: { bPrefix } }) => {
    return names
      .map(item => {
        return item.hasPrefix ? `${bPrefix || prefix}${item.name}` : item.name;
      })
      .join('');
  }, style);
}

function asChild(name: string, style: CNodeChildren | CProperties): CNode {
  return c(({ props: { bPrefix } }) => `>${bPrefix || prefix}${name}`, style);
}

function nextBrother(name: string, brotherName: string, style: CProperties): CNode {
  return c(({ props: { bPrefix } }) => `${bPrefix || prefix}${name} + ${bPrefix || prefix}${brotherName}`, style);
}
// child block
const cCB: typeof cB = ((...args: any[]) => {
  return c('>', [(cB as any)(...args)]);
}) as any;

const mountStyle = (mountId: string, style: CNode | undefined, prefix?: string, anchorMetaName?: string): void => {
  if (style) {
    const clsPrefix = prefix ? prefix : useClsPrefix()?.value;
    style.mount({
      id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
      force: true,
      anchorMetaName: anchorMetaName ? anchorMetaName : 'viewport',
      props: {
        bPrefix: clsPrefix ? `.${clsPrefix}-` : '.ant-',
      },
    });
  }
};

export {
  asBrother,
  asChild,
  asModal,
  asMultipleClass,
  asMultiplePrefixClass,
  c,
  cB,
  cCB,
  cE,
  cM,
  cNotM,
  find,
  insideModal,
  insidePopover,
  mountStyle,
  namespace,
  nextBrother,
  prefix,
};
