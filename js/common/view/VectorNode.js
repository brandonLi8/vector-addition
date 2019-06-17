// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  // constants
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    fill: 'red',
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };
  const VECTOR_GROUP_1 = VectorAdditionConstants.VECTOR_GROUP_1.vectorOptions;
  const VECTOR_GROUP_2 = VectorAdditionConstants.VECTOR_GROUP_2.vectorOptions;

  class VectorNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Bounds2} graphModelBounds - the bounds to the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {VectorOrientations} vectorOrientation - Orientation mode of the vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param  {Object} [arrowOptions]
     */
    constructor( vectorModel,
                 graphModelBounds,
                 componentStyleProperty,
                 angleVisibleProperty,
                 vectorOrientation,
                 modelViewTransformProperty,
                 arrowOptions ) {

      // Type check arguments
      assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty,
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      // modelViewTransformProperty checked in super class


      //----------------------------------------------------------------------------------------
      // Get the arrow options for the specific vector type

      switch( vectorModel.vectorType ) {
        case VectorTypes.ONE: {
          arrowOptions = _.extend( _.clone( VECTOR_GROUP_1 ), arrowOptions );
          break;
        }
        case VectorTypes.TWO: {
          arrowOptions = _.extend( _.clone( VECTOR_GROUP_2 ), arrowOptions );
          break;
        }
        default: {
          throw new Error( `Vector Type : ${vectorModel.vectorType} not handled` );
        }
      }
      super( vectorModel, modelViewTransformProperty, arrowOptions );


      //----------------------------------------------------------------------------------------

      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.components );

      // @public (read-only) {VectorComponentNode}
      this.xComponentNode = new VectorComponentNode( vectorModel.xVectorComponent, modelViewTransformProperty, componentStyleProperty );

      this.addChild( this.xComponentNode );

      // @public (read-only) {VectorComponentNode}
      this.yComponentNode = new VectorComponentNode( vectorModel.yVectorComponent, modelViewTransformProperty, componentStyleProperty );

      this.addChild( this.yComponentNode );

      this.arrowNode.moveToFront();

      this.angleNode = new VectorAngleNode( vectorModel, angleVisibleProperty, modelViewTransformProperty.value );
      this.addChild( this.angleNode );

      // @public (read-only) {Node} Create a circle at the tip of the vector. This is used to allow the user to only
      // change the angle of the arrowNode by only dragging the tip
      this.tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );

      this.addChild( this.tipCircle );

      //----------------------------------------------------------------------------------------
      // @private {Property.<ModelViewTransform2>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {VectorOrientations}
      this.vectorOrientation = vectorOrientation;

      //@private {VectorModel}
      this.vectorModel = vectorModel;


      //----------------------------------------------------------------------------------------
      // Create Body Drag

      // Create a property for the location of the tail of the vector.
      const tailLocationProperty = new Vector2Property(
        modelViewTransformProperty.value.modelToViewPosition( vectorModel.tail ) );

      // drag listener for the dragging of the body
      const bodyDragListener = new DragListener( {
        targetNode: this,
        locationProperty: tailLocationProperty,
        start: () => {
          vectorModel.isBodyDraggingProperty.value = true;
          this.moveToFront();
        },
        end: () => {
          vectorModel.isBodyDraggingProperty.value = false;
        }
      } );

      const tailListener = tailLocation => {
        this.tailSnapToGrid( tailLocation );
      };

      tailLocationProperty.link( tailListener );

      this.arrowNode.addInputListener( bodyDragListener );


      //----------------------------------------------------------------------------------------
      // Create Tip Drag
      if ( vectorModel.isTipDraggable ) {

        // Create a property of the location of the tip of the vector. The location of the tip is measured with respect to the tail.
        const tipLocationProperty = new Vector2Property( tipDeltaLocation );

        // for forwarding drag events for the tip
        const tipDragListener = new DragListener( {
          targetNode: this.tipCircle,
          locationProperty: tipLocationProperty,
          start: () => {
            vectorModel.isTipDraggingProperty.value = true;
            this.moveToFront();
          },
          end: () => {
            vectorModel.isTipDraggingProperty.value = false;
          }
        } );

        const tipListener = tipLocation => {
          this.tipSnapToGrid( tipLocation );
        };

        tipLocationProperty.link( tipListener );

        this.tipCircle.addInputListener( tipDragListener );

        this.disposeTipDrag = () => {
          this.tipCircle.removeInputListener( tipDragListener );
          tipLocationProperty.unlink( tipListener );
        };
      }


      const updateTip = () => {
        const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vectorModel.components );
        this.tipCircle.center = tipDeltaLocation;
      };

      // update the position of the  this.tipCircle
      vectorModel.attributesVectorProperty.link( updateTip );

      // Create a method to dispose children
      this.disposeChildren = () => {
        if ( vectorModel.isTipDraggable ) {
          this.disposeTipDrag();
        }

        this.xComponentNode.dispose();
        this.yComponentNode.dispose();
        this.angleNode.dispose();
        tailLocationProperty.unlink( tailListener );
        vectorModel.attributesVectorProperty.unlink( updateTip );
        this.arrowNode.removeInputListener( bodyDragListener );
        this.tipCircle.dispose();
      };

    }

    /**
     * Dispose the vector
     */
    dispose() {
      this.disposeChildren();
      super.dispose();
    }

    /**
     * update the model vector to have integer components and correct vector orientation
     * (relative to the tail)
     * @param {Vector2} tipLocation
     */
    tipSnapToGrid( tipLocation ) {
      const tipCoordinates = this.modelViewTransformProperty.value.viewToModelDelta( tipLocation );

      switch( this.vectorOrientation ) {
        case VectorOrientations.HORIZONTAL: {
          tipCoordinates.setY( 0 );
          break;
        }
        case VectorOrientations.VERTICAL: {
          tipCoordinates.setX( 0 );
          break;
        }
        case VectorOrientations.TWO_DIMENSIONAL: {
          break;
        }
        default: {
          throw new Error( `vectorOrientation not handled: ${this.vectorOrientation}` );
        }
      }
      this.vectorModel.attributesVectorProperty.value = tipCoordinates.roundedSymmetric();
    }

    /**
     * update the model vector to have integer components and return the location associated with the tail
     * @param {Vector2} tailLocation
     */
    tailSnapToGrid( tailLocation ) {
      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );
      this.vectorModel.tail = tailPosition.roundedSymmetric();
    }


  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );