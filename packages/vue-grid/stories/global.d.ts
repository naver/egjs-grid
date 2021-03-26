declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}
declare module "!!raw-loader!*" {
  const content: string;
  export default content;
}
