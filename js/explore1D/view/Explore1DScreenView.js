// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorDisplayNode = require( 'VECTOR_ADDITION/common/view/VectorDisplayNode' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );
  const VectorPanel = require( 'VECTOR_ADDITION/common/view/VectorPanel' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore1D_screenshot.png' );

  // constants
  const modelBounds = new Bounds2( -30, -20, 30, 20 );
  const viewBounds = new Bounds2( 29, 90, 29 + 750, 90 + 500 );

  class Explore1DScreenView extends ScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super();

      const modelViewTransform = new ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewBounds );

      // Show the mock-up and a slider to change its transparency
      const mockupOpacityProperty = new NumberProperty( 0.0 );
      const image = new Image( mockupImage, { pickable: false, scale: 0.67, top: 0, left: 0 } );

      const screenshotHSlider = new HSlider( mockupOpacityProperty, new Range( 0, 1 ), { top: 0, left: 0 } );
      mockupOpacityProperty.linkAttribute( image, 'opacity' );

      const sumVisibleProperty = new BooleanProperty( false );
      const valuesVisibleProperty = new BooleanProperty( false );
      const angleVisibleProperty = new BooleanProperty( false );
      const gridVisibleProperty = new BooleanProperty( false );
      const vectorOrientationProperty = new Property( VectorOrientation.HORIZONTAL );

      const gridPanel = new GridPanel( sumVisibleProperty,
        valuesVisibleProperty,
        angleVisibleProperty,
        gridVisibleProperty, {
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      const modelVector = new Vector( new Vector2Property( new Vector2( 0, 0 ) ),
        new Vector2Property( new Vector2( 5, 0 ) ),
        new BooleanProperty( false ),
        new NumberProperty( 0 ) );

      const vectorDisplayNode = new VectorDisplayNode( modelVector );

      vectorDisplayNode.centerX = this.layoutBounds.maxX / 2;
      vectorDisplayNode.top = 10;
      this.addChild( vectorDisplayNode );

      const graphNode = new GraphNode( vectorOrientationProperty, gridVisibleProperty, modelViewTransform, modelBounds );

      const ArrowNodeOptions = { fill: 'black', doubleHead: true, tailWidth: 3, headWidth: 8, headHeight: 10 };
      // Scene radio buttons
      const sceneRadioButtonContent = [ {
        value: VectorOrientation.HORIZONTAL,
        node: new ArrowNode( 0, 0, 40, 0, ArrowNodeOptions )
      }, {
        value: VectorOrientation.VERTICAL,
        node: new ArrowNode( 0, 0, 0, 40, ArrowNodeOptions )
      } ];

      const sceneRadioButtonGroup = new RadioButtonGroup( vectorOrientationProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.layoutBounds.maxX - 4,
        top: gridPanel.bottom + 10,
        orientation: 'horizontal'
      } );

      const vectorPanel = new VectorPanel( modelViewTransform, modelVector );
      this.addChild( graphNode );
      this.addChild( gridPanel );
      this.addChild( vectorPanel );
      this.addChild( sceneRadioButtonGroup );
      this.addChild( image );
      this.addChild( screenshotHSlider );


      const resetAllButton = new ResetAllButton( {
        listener: () => {
          explore1DModel.reset();
          sumVisibleProperty.reset();
          valuesVisibleProperty.reset();
          angleVisibleProperty.reset();
          gridVisibleProperty.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }


  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );