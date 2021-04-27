export function makeVueApp(AppComponent: any): any {
  return (args: any, { argTypes }: any) => ({
    components: {
      App: AppComponent,
    },
    props: ["args", ...Object.keys(argTypes)],
    setup() {
      return { ...args, args };
    },
    computed: {
      key() {
        console.log(Math.random())
        return Math.random();
      },
    },
    template: '<App v-bind="args || $props" :key="Math.random()" />',
  });
}
