// Copyright 2019, University of Colorado Boulder

/**
 * View for the component vectors of a vector
 * Constructed based on many individually passed parameters about the vector node.
 * Listens to the componentStyleProperty to determine which style of components to display.
 * Listens to a model vector's vectorProperty to rescale and reposition the components.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const ARROW_OPTIONS = {
    fill: VectorAdditionColors.LIGHT_BLUE_VECTOR_COMPONENT_COLOR,
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  };
  const ON_AXIS_LINES_LINE_DASH = [ 3, 10 ];

  class VectorComponentsNode extends Node {

    /**
     * @param {VectorModel} vectorModel- the vector model
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property related to the style of components to display
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property of the coordinate transformation
     * between view and model coordinates
     */
    constructor( vectorModel, componentStyleProperty, modelViewTransformProperty ) {

      super();

      // The origin of this node (0, 0) is the tail of the vector.
      // Create the 2 component nodes. These will be translated depending on the component style value
      const XComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );
      const YComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      // create a path  that represents the dashed lines corresponding to the on_axis style
      // the shape of the path will be updated later
      const onAxisLinesPath = new Path( new Shape(), {
        stroke: 'black',
        lineDash: ON_AXIS_LINES_LINE_DASH
      } );

      // add the components to the scene graph
      this.setChildren( [ onAxisLinesPath, XComponentArrow, YComponentArrow ] );

      // create a function that updates the style of the components and their locations
      const updateComponents = ( componentStyle, attributesVector, tailPosition, modelViewTransform ) => {

        if ( componentStyle === ComponentStyles.INVISIBLE ) {
          // make the components invisible
          this.visible = false;
          onAxisLinesPath.visible = false;
          return;
        }

        // make the components visible
        this.visible = true;
        onAxisLinesPath.visible = false;

        // get the coordinates for each components
        const xComponentCoordinates = vectorModel.getXComponentCoordinates( componentStyle );
        const yComponentCoordinates = vectorModel.getYComponentCoordinates( componentStyle );

        // transform the coordinates into view and defining the tip of the node as (0, 0)
        const xComponentTail = modelViewTransform.modelToViewDelta( xComponentCoordinates.tail.minus( tailPosition ) );
        const xComponentTip = modelViewTransform.modelToViewDelta( xComponentCoordinates.tip.minus( tailPosition ) );
        const yComponentTail = modelViewTransform.modelToViewDelta( yComponentCoordinates.tail.minus( tailPosition ) );
        const yComponentTip = modelViewTransform.modelToViewDelta( yComponentCoordinates.tip.minus( tailPosition ) );

        // update the component arrows
        XComponentArrow.setTailAndTip( xComponentTail.x, xComponentTail.y, xComponentTip.x, xComponentTip.y );
        YComponentArrow.setTailAndTip( yComponentTail.x, yComponentTail.y, yComponentTip.x, yComponentTip.y );

        if ( componentStyle === ComponentStyles.ON_AXIS ) {

          // make the on axis dashed lines visible
          onAxisLinesPath.visible = true;

          const tailLocation = modelViewTransform.modelToViewDelta( tailPosition );

          const viewVector = modelViewTransform.modelToViewDelta( attributesVector );
          // create new shape for the dashed lines that extend to the axis
          const onAxisLines = new Shape();

          // create the dashed lines shape
          // draw the first 2 lines to create the subbox of the tail of the vector
          onAxisLines.moveTo( -tailLocation.x, 0 ).horizontalLineTo( 0 )
            .verticalLineTo( -tailLocation.y );

          // draw the next 2 lines to create the subbox of the tip of the vector
          onAxisLines.moveTo( -tailLocation.x, viewVector.y ).horizontalLineTo( viewVector.x )
            .verticalLineTo( -tailLocation.y );

          // set the shape of the path to update the view
          onAxisLinesPath.setShape( onAxisLines );
        }
      };

      // @private
      this.updateLayoutMultilink = Property.multilink( [
          componentStyleProperty,
          vectorModel.attributesVectorProperty,
          vectorModel.tailPositionProperty,
          modelViewTransformProperty
        ],
        updateComponents
      );
    }

    /**
     * @public
     */
    dispose() {
      this.updateLayoutMultilink.dispose();
      super.dispose();
    }
  }

  return vectorAddition.register( 'VectorComponentsNode', VectorComponentsNode );
} );