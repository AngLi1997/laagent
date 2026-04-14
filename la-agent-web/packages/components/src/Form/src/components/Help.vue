<script lang="tsx">
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { isArray, isFunction, isString } from '@bmos/utils';
  import { Tooltip } from 'ant-design-vue';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, unref } from 'vue';
  import { getSlot } from '../utils/tsxHelper';
  import { JSX } from 'vue/jsx-runtime';

  const props = {
    /**
     * Help text max-width
     * @default: 600px
     */
    maxWidth: { type: String, default: '600px' },
    /**
     * Whether to display the serial number
     * @default: false
     */
    showIndex: { type: Boolean },
    /**
     * Help text font color
     * @default: #ffffff
     */
    color: { type: String, default: '#ffffff' },
    /**
     * Help text font size
     * @default: 14px
     */
    fontSize: { type: String, default: '14px' },
    /**
     * Help text list
     */
    placement: { type: String, default: 'right' },
    /**
     * Help text list
     */
    text: {
      type: [Array, String, Object] as PropType<string[] | string | JSX.Element>,
    },
  };

  export default defineComponent({
    name: 'BasicHelp',
    components: { Tooltip },
    props,
    setup(props, { slots }) {
      const getTooltipStyle = computed((): CSSProperties => ({ color: props.color, fontSize: props.fontSize }));

      const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }));

      function renderTitle() {
        const textList = props.text;

        if (isString(textList)) {
          return <p>{textList}</p>;
        }

        if (isArray(textList)) {
          return textList.map((text, index) => {
            return (
              <p key={text}>
                <>
                  {props.showIndex ? `${index + 1}. ` : ''}
                  {text}
                </>
              </p>
            );
          });
        }
        if (isFunction(textList)) {
          return textList();
        }
        return null;
      }

      return () => {
        return (
          <Tooltip
            overlayClassName='basic-help__wrap'
            title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
            autoAdjustOverflow={true}
            overlayStyle={unref(getOverlayStyle)}
            placement={props.placement as 'right'}>
            <span class='basic-help'>{getSlot(slots) || <InfoCircleOutlined />}</span>
          </Tooltip>
        );
      };
    },
  });
</script>
