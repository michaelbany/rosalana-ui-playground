<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from "reka-ui";
import { tv, type VariantProps } from "tailwind-variants";
import UiIcon from "../UiIcon.vue";
import { Motion } from "motion-v";

const buttonStyles = tv({
  base:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none " +
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
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
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      "icon-sm": "size-8",
      icon: "size-9",
      "icon-lg": "size-10",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
      false: "",
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
  <Motion as-child initial="rest" while-hover="hover">
    <Primitive
      v-bind="forwarded"
      :as="as"
      :as-child="asChild"
      :class="buttonStyles({ variant, size, disabled: disabled || loading })"
      class="relative overflow-hidden"
      :disabled="disabled || loading"
    >
      <UiIcon
        v-if="loading"
        name="line-md:loading-loop"
        class="shrink-0 animate-spin"
      />
      <Motion
        class="inline-block"
        :variants="{
          rest: { y: 0, opacity: 1 },
          hover: { y: -10, opacity: 0 },
        }"
        :transition="{ duration: 0.2 }"
      >
        <slot />
      </Motion>

      <Motion
        class="absolute inline-block"
        :variants="{
          rest: { y: 10, opacity: 0 },
          hover: { y: 0, opacity: 1 },
        }"
        :transition="{ duration: 0.2 }"
      >
        <slot />
      </Motion>
    </Primitive>
  </Motion>
</template>
