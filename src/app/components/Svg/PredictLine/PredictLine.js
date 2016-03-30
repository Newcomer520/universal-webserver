import React, { Component, PropTypes } from 'react'
import Line from 'components/Svg/Line'
import FillArea from 'components/Svg/FillArea'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class PredictLine extends Component {

  static propTypes = {
    fitPoints: PropTypes.array,
    uprPoints: PropTypes.array,
    lwrPoints: PropTypes.array,
    lineStyles: PropTypes.object,
    fillStyles: PropTypes.object
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { fitPoints, uprPoints, lwrPoints,
            lineStyles, fillStyles, ...rest } = this.props

    return (
      <g>
        <FillArea pointsUp={uprPoints} pointsBottom={lwrPoints}
          fillStyles={{ ...fillStyles }} {...rest} />
        <Line points={fitPoints} {...rest} lineStyles={lineStyles} />
        <Line points={uprPoints} {...rest}
          lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
        <Line points={lwrPoints} {...rest}
          lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
      </g>
    )
  }
}
