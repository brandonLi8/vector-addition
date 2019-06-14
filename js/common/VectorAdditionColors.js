// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the project.
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // shared colors
  const WHITE = 'rgb( 255, 255, 255 )';
  const BLACK = 'rgb( 0, 0, 0 )';
  const LIGHT_GREY = 'rgb( 235, 235, 235 )';  // panel color

  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // Various backgrounds
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',
    CONTROL_PANEL_BACKGROUND: LIGHT_GREY,
    INSPECT_VECTOR_BACKGROUND: LIGHT_GREY,
    VECTOR_CREATOR_BACKGROUND: WHITE,
    GRAPH_BACKGROUND: WHITE,

    //----------------------------------------------------------------------------------------
    // General   
    RADIO_BUTTON_COLORS: {
      baseColor: WHITE,
      selectedStroke: '#419ac9'
    },

    //----------------------------------------------------------------------------------------
    // Graph colors
    ORIGIN_DOT_COLOR: 'rgb( 25, 253, 56 )',
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 220, 220, 220 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 230, 230, 230 )',
    TICKS_COLOR: BLACK,


    //----------------------------------------------------------------------------------------
    // Vector Inspect Panel
    INSPECT_VECTOR_BORDER_COLOR: 'rgb( 190, 190, 190 )',


    //----------------------------------------------------------------------------------------
    // Graph Control Panel
    GRAPH_CONTROL_PANEL_LINE_COLOR: BLACK,
    GRID_ICON_COLOR: 'rgb( 120, 120, 120 )',
    ANGLE_ICON_COLOR: BLACK,


    //----------------------------------------------------------------------------------------
    // Vector colors
    VECTOR_GROUP_1_COLORS: {
      fill: 'rgb( 0, 185, 255 )',
      sum: 'rgb( 0, 181, 225 )',
      component: 'rgb( 155, 222, 255 )'
    },
    VECTOR_GROUP_2_COLORS: {
      fill: '#E81909',
      sum: '#5B1909',
      component: '#FF0C2D'
    },
    POLAR_ICON_VECTOR_COLOR: 'rgb( 188, 3, 255 )',
    CARTESIAN_ICON_COLOR: BLACK,
    VECTOR_ICON_STROKE_COLOR: BLACK


  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );