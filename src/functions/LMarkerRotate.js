import { Functions, Utilities } from '@vue-leaflet/vue-leaflet';

export const markerProps = {
  ...Functions.Layer.layerProps,
  draggable: {
    type: Boolean,
    custom: true,
    default: false
  },
  icon: {
    type: [Object],
    default: () => undefined,
    custom: false
  },
  zIndexOffset: {
    type: Number,
    custom: false,
    default: null
  },
  latLng: {
    type: [Object, Array],
    custom: true,
    required: true
  },
  pane: {
    type: String,
    default: 'markerPane'
  },
  opacity: {
    type: Number,
    default: () => 1.0,
    custom: false
  },
  rotationAngle: {
    type: Number,
    custom: true
  },
  rotationOrigin: {
    type: String,
    custom: false,
    default: 'center'
  }
};

export const markerSetup = (props, leafletRef, context) => {
  const { options: layerOptions, methods: layerMethods } = Functions.Layer.setupLayer(
    props,
    leafletRef,
    context
  );

  const options = Utilities.propsToLeafletOptions(props, markerProps, layerOptions);

  const methods = {
    ...layerMethods,
    setDraggable(value) {
      if (leafletRef.value.dragging) {
        value ? leafletRef.value.dragging.enable() : leafletRef.value.dragging.disable();
      }
    },
    latLngSync(event) {
      context.emit('update:latLng', event.latlng);
      context.emit('update:lat-lng', event.latlng);
    },
    setOpacity(newVal) {
      if (leafletRef.value) {
        leafletRef.value.setOpacity(newVal);
      }
    },
    setLatLng(newVal) {
      if (newVal == null) return;

      if (leafletRef.value) {
        const oldLatLng = leafletRef.value.getLatLng();
        if (!oldLatLng || !oldLatLng.equals(newVal)) {
          leafletRef.value.setLatLng(newVal);
        }
      }
    },
    setRotationAngle(value) {
      if (leafletRef.value) {
        leafletRef.value.setRotationAngle(value);
      }
    }
  };
  return { options, methods };
};

export function markerInit(L) {
  const proto_initIcon = L.Marker.prototype._initIcon;
  const proto_setPos = L.Marker.prototype._setPos;
  const oldIE = L.DomUtil.TRANSFORM === 'msTransform';

  L.Marker.addInitHook(function () {
    this.options.rotationOrigin = this.options.rotationOrigin;
    this.options.rotationAngle = this.options.rotationAngle;

    // Ensure marker keeps rotated during dragging
    this.on('drag', function (e) {
      e.target._applyRotation();
    });
  });

  L.Marker.include({
    _initIcon: function () {
      proto_initIcon.call(this);
    },

    _setPos: function (pos) {
      proto_setPos.call(this, pos);
      this._applyRotation();
    },

    _applyRotation: function () {
      if (this.options.rotationAngle) {
        this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

        if (oldIE) {
          // for IE 9, use the 2D rotation
          this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
        } else {
          // for modern browsers, prefer the 3D accelerated version
          this._icon.style[L.DomUtil.TRANSFORM] +=
            ' rotateZ(' + this.options.rotationAngle + 'deg)';
        }
      }
    },

    setRotationAngle: function (angle) {
      this.options.rotationAngle = angle;
      this.update();
      return this;
    },

    setRotationOrigin: function (origin) {
      this.options.rotationOrigin = origin;
      this.update();
      return this;
    }
  });
}
