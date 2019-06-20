// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Vector2 = require( 'DOT/Vector2' );

  //----------------------------------------------------------------------------------------
  // for all panel-like containers
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 12;
  const PANEL_Y_MARGIN = 12;

  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // Margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 6,
    SCREEN_VIEW_Y_MARGIN: 6,

    //----------------------------------------------------------------------------------------
    // Defaults for all Panel instances
    PANEL_OPTIONS: {
      align: 'left',
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      fill: VectorAdditionColors.PANEL_BACKGROUND,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR
    },
    PANEL_FONT: new PhetFont( 18 ),
    PANEL_WIDTH: 135,
    CHECKBOX_LABEL_SPACING: 10,

    //----------------------------------------------------------------------------------------
    // Vector Creator Panels
    VECTOR_CREATOR_PANEL_OPTIONS: {
      fill: VectorAdditionColors.VECTOR_CREATOR_BACKGROUND,
      xMargin: 8,
      yMargin: 4
    },

    //----------------------------------------------------------------------------------------
    // Defaults for graph location
    GRAPH_DIMENSION: new Dimension2( 60, 40 ),
    GRAPH_UPPER_LEFT_COORDINATE: new Vector2( -5, 35 ),

    // location of the upper left of the graph in view coordinates
    GRAPH_UPPER_LEFT_LOCATION: new Vector2( 29, 90 ),

    // scale conversion factor from model to view coordinates
    MODEL_TO_VIEW_SCALE_FACTOR: 12.5,

    //----------------------------------------------------------------------------------------
    // Defaults for all vector arrow nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    //----------------------------------------------------------------------------------------
    // Defaults for the vector creator panel icon
    VECTOR_CREATOR_PANEL_ARROW_OPTIONS: {
      lineWidth: 0,
      tailWidth: 4,
      headWidth: 10.5,
      headHeight: 6,
      cursor: 'pointer'
    },

    // Default vector type for Explore1D, Explore2D and Equation.
    VECTOR_TYPE: VectorTypes.ONE,

    // side length of the arrow when initially dropped onto the graph.
    INITIAL_ARROW_SIDE_LENGTH: 5

  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );
