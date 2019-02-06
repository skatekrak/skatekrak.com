import React from 'react';
import ReactTooltip from 'react-tooltip';

const TooltipWithStyle: React.SFC = ({ ...props }) => <ReactTooltip className="tooltip" effect="solid" {...props} />;

export default TooltipWithStyle;
