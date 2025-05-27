<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from "reka-ui";
import { tv, type VariantProps } from "tailwind-variants";

const buttonStyles = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      action: "bg-action text-action-foreground hover:bg-action/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghostline:
        "border border-input hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      linkHover1:
        "relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0",
      linkHover2:
        "relative after:absolute after:bottom-2 after:left-0 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      xs: "h-8 rounded-md px-2",
      lg: "h-11 rounded-md px-8",
      "icon-sm": "h-9 w-9",
      icon: "h-10 w-10",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles>;

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** The type for the button */
      type?: "button" | "submit" | "reset";
      /** Whether the button is disabled */
      disabled?: boolean;
      /** Whether the button is loading */
      loading?: boolean;
      /** The action to perform when the button is clicked */
      onClick?: any;
      /** Custom class(es) to add to parent element */
      class?: any;
      /** The variant of the button */
      variant?: ButtonProps["variant"];
      /** The size of the button */
      size?: ButtonProps["size"];
      /** The text to display in the button */
      text?: string;
    }
  >(),
  {
    type: "button",
    as: "button",
    loadingIcon: "line-md:loading-loop",
    iconPlacement: "left",
    loading: false,
  }
);

const forwarded = useForwardProps(props);
</script>
<template>
  <Primitive v-bind="forwarded" :class="buttonStyles({ variant, size, disabled: props.disabled, class: props.class })" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
