var _class, _temp, _initialiseProps;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, createRef, Fragment } from 'react';
import { Wrapper } from './Style';

var DEGREE_IN_RADIANS = Math.PI / 180;
var classNamePrefix = 'RoundSlider';

var Roundy = (_temp = _class = function (_Component) {
  _inherits(Roundy, _Component);

  function Roundy(props) {
    _classCallCheck(this, Roundy);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    var value = props.value,
        arcSize = props.arcSize,
        rotationOffset = props.rotationOffset;

    _this.state = {
      value: value,
      angle: _this.valueToAngle(value)
    };
    if (arcSize <= 0) {
      console.warn('arcSize should be between 1 and 360.');
    }
    if (rotationOffset < -180 || rotationOffset > 180) {
      console.warn('rotationOffset prop should be between -180 and 180.');
    }
    _this.uniqueId = Math.floor(Math.random() * 100) + Date.now();
    _this.touches = [];
    _this.allowChange = false;
    _this.isDrag = false;
    _this._wrapper = createRef();
    _this._handle = createRef();
    return _this;
  }

  Roundy.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.state.value !== props.value) {
      var value = props.value;
      this.setState({
        value: value,
        angle: this.valueToAngle(value)
      });
    }
  };

  Roundy.prototype.componentDidMount = function componentDidMount() {
    if (!this.props.allowClick && this._wrapper.current) {
      this._wrapper.current.style.pointerEvents = 'none';
    }
  };

  Roundy.prototype.polarToCartesian = function polarToCartesian(_ref) {
    var pathRadius = _ref.pathRadius,
        angle = _ref.angle,
        radius = _ref.radius;

    var angleInRadians = (angle - 180) * DEGREE_IN_RADIANS;
    var x = radius + pathRadius * Math.cos(angleInRadians);
    var y = radius + pathRadius * Math.sin(angleInRadians);

    return x + ' ' + y;
  };

  Roundy.prototype.getCenter = function getCenter() {
    var rect = this._wrapper.current.getBoundingClientRect();
    return {
      top: rect.top + this.props.radius,
      left: rect.left + this.props.radius
    };
  };

  Roundy.prototype.radToDeg = function radToDeg(rad) {
    return rad * (180 / Math.PI);
  };

  Roundy.prototype.angle = function angle(y, x) {
    var rotationOffset = this.props.rotationOffset;

    var angle = this.radToDeg(Math.atan2(y, x)) + 180 - rotationOffset;
    if (angle > 360) {
      angle = angle - 360;
    }
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  };

  Roundy.prototype.stepRounding = function stepRounding(degree) {
    var _props = this.props,
        stepSize = _props.stepSize,
        steps = _props.steps,
        min = _props.min,
        max = _props.max,
        arcSize = _props.arcSize;

    var step = stepSize || (steps ? (max - min) / steps : 1);
    var oldAngle = this.state.angle;

    var angToValue = min;
    if (!this.isDrag) {
      angToValue = this.angleToValue(degree);
    } else {
      angToValue = this.angleToValue(oldAngle > arcSize - 20 && degree < arcSize / 4 ? Math.max(degree, arcSize) : oldAngle < 20 && degree > arcSize - 20 ? Math.min(degree, 0) : degree);
    }
    var value = void 0;
    var remain = (angToValue - min) % step;
    var currVal = angToValue - remain;
    var nextVal = this.limitValue(currVal + step);
    var preVal = this.limitValue(currVal - step);
    if (angToValue >= currVal) value = angToValue - currVal < nextVal - angToValue ? currVal : nextVal;else {
      value = currVal - angToValue > angToValue - preVal ? currVal : preVal;
    }
    value = Math.round(value);
    var ang = this.valueToAngle(value);
    return { value: value, angle: ang };
  };

  Roundy.prototype.getMaskLine = function getMaskLine(segments, index) {
    var _props2 = this.props,
        radius = _props2.radius,
        arcSize = _props2.arcSize;

    var val = arcSize / segments * index + 180;
    var rotateFunction = 'rotate(' + val.toString() + ',' + radius + ',' + radius + ')';
    return React.createElement(
      'g',
      { key: index, transform: rotateFunction },
      React.createElement('line', {
        x1: radius,
        y1: radius,
        x2: radius * 2,
        y2: radius,
        style: {
          stroke: 'rgb(0,0,0)',
          strokeWidth: 2
        }
      })
    );
  };

  Roundy.prototype.render = function render() {
    var _this2 = this;

    var _props3 = this.props,
        color = _props3.color,
        bgColor = _props3.bgColor,
        max = _props3.max,
        min = _props3.min,
        steps = _props3.steps,
        stepSize = _props3.stepSize,
        strokeWidth = _props3.strokeWidth,
        thumbSize = _props3.thumbSize,
        radius = _props3.radius,
        sliced = _props3.sliced,
        render = _props3.render,
        style = _props3.style,
        arcSize = _props3.arcSize,
        rotationOffset = _props3.rotationOffset,
        allowClick = _props3.allowClick,
        overrideStyle = _props3.overrideStyle;
    var angle = this.state.angle;

    var segments = steps || (stepSize ? Math.floor((max - min) / stepSize) : 0);
    var maskName = classNamePrefix + '_' + this.uniqueId;
    var size = radius * 2;
    var styleRotation = {
      transform: 'rotate(' + rotationOffset + 'deg)',
      transformOrigin: '50% 50%'
    };
    return React.createElement(
      Wrapper,
      {
        strokeWidth: strokeWidth,
        thumbSize: thumbSize,
        onMouseMove: function onMouseMove(e) {
          return _this2.allowChange && _this2.updateValue(e, false);
        },
        onMouseUp: this.up,
        onMouseDown: this.down,
        onTouchMove: this.getTouchMove,
        onTouchEnd: this.up,
        onTouchCancel: this.up,
        style: style,
        allowClick: allowClick,
        overrideStyle: overrideStyle
      },
      render ?
      // use render props
      React.createElement(
        'div',
        {
          className: 'customWrapper',
          ref: this._wrapper,
          style: { width: size, height: size, display: 'inline-block' }
        },
        render(this.state, this.props)
      ) : React.createElement(
        Fragment,
        null,
        React.createElement(
          'svg',
          { ref: this._wrapper, width: size, height: size },
          sliced && React.createElement(
            'defs',
            null,
            React.createElement(
              'mask',
              {
                id: maskName,
                maskUnits: 'userSpaceOnUse',
                style: styleRotation
              },
              React.createElement('rect', { x: 0, y: 0, width: size, height: size, fill: 'white' }),
              Array(segments).fill().map(function (e, i) {
                return _this2.getMaskLine(segments, i);
              })
            )
          ),
          React.createElement('path', {
            fill: 'transparent',
            strokeDashoffset: '0',
            strokeWidth: strokeWidth,
            stroke: bgColor,
            mask: sliced ? 'url(#' + maskName + ')' : null,
            style: styleRotation,
            d: this.getArc(Math.min(arcSize, 359.9999), 0)
          }),
          React.createElement('path', {
            fill: 'none',
            strokeWidth: strokeWidth,
            stroke: color,
            mask: sliced ? 'url(#' + maskName + ')' : null,
            style: styleRotation,
            d: this.getArc(Math.min(angle, 359.9999), 0)
          })
        ),
        React.createElement('div', {
          ref: this._handle,
          className: 'sliderHandle',
          onMouseDown: this.down,
          onTouchStart: this.down,
          onMouseUp: this.up,
          style: {
            transform: 'rotate(' + (angle + rotationOffset) + 'deg) scaleX(-1)'
          }
        })
      )
    );
  };

  return Roundy;
}(Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.up = function (e) {
    if (!_this3.props.allowClick && _this3._wrapper.current) {
      _this3._wrapper.current.style.pointerEvents = 'none';
    }
    _this3.allowChange = false;
    _this3.isDrag = false;
    _this3.touches = []; // clear touches
    // e.preventDefault()
    e.stopPropagation();
    _this3.props.onAfterChange && _this3.props.onAfterChange(_this3.value, _this3.props);
  };

  this.getTouchMove = function (e) {
    e.stopPropagation();
    if (_this3.allowChange || _this3.isDrag) {
      var idx = 0;
      for (var index = 0; index < e.changedTouches.length; index++) {
        var t = e.changedTouches[index];
        if (t.identifier >= 0) {
          _this3.touches = [t];
          _this3.updateValue(_this3.touches[idx]);
        }
      }
    }
  };

  this.down = function (e) {
    if (_this3._wrapper.current) {
      _this3._wrapper.current.style.pointerEvents = 'auto';
    }
    e.stopPropagation();
    // e.preventDefault()
    // we update first value, then we decide based on rotation
    if (!_this3.isDrag) {
      _this3.updateValue(e, _this3.props.allowClick);
    }
    _this3.allowChange = true;
    _this3.isDrag = true;
    if (e.changedTouches) {
      var _touches;

      (_touches = _this3.touches).push.apply(_touches, e.changedTouches);
    }
  };

  this.getArc = function (startAngle, endAngle) {
    var _props4 = _this3.props,
        radius = _props4.radius,
        strokeWidth = _props4.strokeWidth;

    var pathRadius = radius - strokeWidth / 2;
    var start = _this3.polarToCartesian({
      radius: radius,
      pathRadius: pathRadius,
      angle: startAngle
    });
    var end = _this3.polarToCartesian({
      radius: radius,
      pathRadius: pathRadius,
      angle: endAngle
    });
    var arcSweep = startAngle <= 180 ? 0 : 1;

    return 'M ' + start + ' A ' + pathRadius + ' ' + pathRadius + ' 0 ' + arcSweep + ' 0 ' + end;
  };

  this.limitValue = function (value) {
    var _props5 = _this3.props,
        min = _props5.min,
        max = _props5.max;

    if (value < min) value = min;
    if (value > max) value = max;
    return value;
  };

  this.angleToValue = function (angle) {
    var _props6 = _this3.props,
        min = _props6.min,
        max = _props6.max,
        arcSize = _props6.arcSize;

    var v = angle / arcSize * (max - min) + min;
    return v;
  };

  this.valueToAngle = function (value) {
    var _props7 = _this3.props,
        max = _props7.max,
        min = _props7.min,
        arcSize = _props7.arcSize;

    var angle = (value - min) / (max - min) * arcSize;
    return angle;
  };

  this.updateValue = function (event, forceSet) {
    if (!_this3.isDrag && !forceSet) return;
    var eX = 0,
        eY = 0;
    var clientX = event.clientX,
        clientY = event.clientY;

    eX = clientX;
    eY = clientY;

    var _getCenter = _this3.getCenter(),
        left = _getCenter.left,
        top = _getCenter.top;

    var x = eX - left,
        y = eY - top;

    var _stepRounding = _this3.stepRounding(_this3.angle(y, x)),
        value = _stepRounding.value,
        angle = _stepRounding.angle;

    _this3.setState({ value: value, angle: angle });
    _this3.props.onChange && _this3.props.onChange(value, _this3.props);
  };
}, _temp);


Roundy.defaultProps = {
  color: 'purple',
  bgColor: '#ccc',
  max: 100,
  min: 0,
  stepSize: 0,
  // by default we want smooth sliding
  steps: 0,
  thumbSize: 20,
  sliced: true,
  strokeWidth: 35,
  rotationOffset: 0,
  arcSize: 360,
  value: 50, // so we can see some difference
  radius: 100
};
export default Roundy;