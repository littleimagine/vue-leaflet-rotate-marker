<script>
import { onMounted, ref, provide, inject, nextTick, onBeforeUnmount, markRaw } from 'vue';
import { Utilities, Functions, InjectionKeys } from '@vue-leaflet/vue-leaflet';
import { LMarkerRotate, Utilities as MarkerUtils } from '@/functions';

/**
 * Marker component, add and personalize markers on the map
 */
export default {
  props: LMarkerRotate.markerProps,
  setup(props, context) {
    const leafletObject = ref();
    const ready = ref(false);

    const useGlobalLeaflet = inject(InjectionKeys.UseGlobalLeafletInjection);
    const addLayer = Utilities.assertInject(InjectionKeys.AddLayerInjection);

    provide(InjectionKeys.CanSetParentHtmlInjection, () => !!leafletObject.value.getElement());
    provide(InjectionKeys.SetParentHtmlInjection, html => {
      const el =
        Utilities.isFunction(leafletObject.value?.getElement) && leafletObject.value?.getElement();
      if (!el) return;
      el.innerHTML = html;
    });
    provide(
      InjectionKeys.SetIconInjection,
      newIcon => leafletObject.value?.setIcon && leafletObject.value.setIcon(newIcon)
    );
    const { options, methods } = LMarkerRotate.markerSetup(props, leafletObject, context);

    const eventHandlers = {
      moveHandler: MarkerUtils.debounce(methods.latLngSync, 100)
    };

    onMounted(async () => {
      const L = useGlobalLeaflet
        ? Utilities.WINDOW_OR_GLOBAL.L
        : await import('leaflet/dist/leaflet-src.esm');
      const { marker, divIcon } = L;

      if (Functions.Marker.shouldBlankIcon(options, context)) {
        options.icon = divIcon();
      }

      if (!L.Marker.prototype.setRotationAngle) {
        LMarkerRotate.markerInit(L);
      }

      leafletObject.value = await markRaw(marker(props.latLng, options));
      leafletObject.value.setRotationAngle(props?.rotationAngle);

      const { listeners } = Utilities.remapEvents(context.attrs);
      leafletObject.value.on(listeners);

      leafletObject.value.on('move', eventHandlers.moveHandler);
      Utilities.propsBinder(methods, leafletObject.value, props);
      addLayer({
        ...props,
        ...methods,
        leafletObject: leafletObject.value
      });
      ready.value = true;
      nextTick(() => context.emit('ready', leafletObject.value));
    });

    onBeforeUnmount(() => Utilities.cancelDebounces(eventHandlers));

    return { ready, leafletObject };
  },
  render() {
    return Functions.Layer.render(this.ready, this.$slots);
  }
};
</script>
