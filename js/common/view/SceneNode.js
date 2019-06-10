// Copyright 2019, University of Colorado Boulder

/**
 * A node for a scene. Explore1D has 2 scenes.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorDisplayPanel = require( 'VECTOR_ADDITION/common/view/VectorDisplayPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants
  const VECTOR_DISPLAY_PANEL_LOCATION_LEFT = VectorAdditionConstants.VECTOR_DISPLAY_PANEL_LOCATION.left;
  const VECTOR_DISPLAY_PANEL_LOCATION_TOP = VectorAdditionConstants.VECTOR_DISPLAY_PANEL_LOCATION.top;
  const VECTOR_OPTIONS = VectorAdditionConstants.VECTOR_ARROW_OPTIONS;
  const VECTOR_SUM_OPTIONS = VectorAdditionConstants.VECTOR_SUM_ARROW_OPTIONS;

  class Scene extends Node {
    /**
     * @param {Graph} graph - the graph the scene represents
     * @param {CommonModel} model
     */
    constructor( model, graph ) {

      super();


      // Create the Graph Node
      const graphNode = new GraphNode( graph );

      // Create the vector display panel
      const vectorDisplayPanel = new VectorDisplayPanel(
        graph.vectors,
        graph );

      // set the panel in the correct location
      vectorDisplayPanel.left = VECTOR_DISPLAY_PANEL_LOCATION_LEFT;
      vectorDisplayPanel.top = VECTOR_DISPLAY_PANEL_LOCATION_TOP;

      // create the vector layer
      const vectorLayer = new Node();

      graph.vectors.addItemAddedListener( ( addedVector ) => {
        const vectorNode = new VectorNode(
          addedVector,
          graph.graphModelBounds,
          model.componentStyleProperty,
          model.angleVisibleProperty,
          graph.modelViewTransformProperty,
          VECTOR_OPTIONS
        );

        vectorLayer.addChild( vectorNode );

        // Add the removal listener in case this vector is removed from the model.
        const removalListener = removedVector => {
          if ( removedVector === addedVector ) {

            // remove its node from the view
            vectorNode.dispose();

            // remove this listener to avoid leaking memory
            graph.vectors.removeItemRemovedListener( removalListener );
          }
        };

        // link removalListener to the provided ObservableArray
        graph.vectors.addItemRemovedListener( removalListener );
      } );


      // create a scenery node for the sum vector
      const vectorSumNode = new VectorNode( 
        graph.vectorSum,
        graph.graphModelBounds,
        model.componentStyleProperty,
        model.angleVisibleProperty,
        graph.modelViewTransformProperty,
        VECTOR_SUM_OPTIONS
      );

      // link the visibility of the Vector Sum node with the status of the checkbox
      model.sumVisibleProperty.linkAttribute( vectorSumNode, 'visible' );

      this.setChildren([
        graphNode,
        vectorDisplayPanel,
        vectorSumNode,
        vectorLayer ]);
    }
  }

  return vectorAddition.register( 'Scene', Scene );
} );