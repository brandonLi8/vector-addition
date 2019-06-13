// Copyright 2019, University of Colorado Boulder

/**
 * Shared screen view for all screens
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {CommonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( commonModel, tandem ) {

      super();

      // @public (read-only) {array.<SceneNode>}
      this.sceneNodes = [];

      // loop through each scene in the model and add a scene node
      for ( let i = 0; i < commonModel.scenes.length; i++ ) {

        // create a scene node and add it as a child
        const sceneNode = new SceneNode( commonModel.scenes[ i ], commonModel );
        this.addChild( sceneNode );

        // add it to the sceneNode array
        this.sceneNodes.push( sceneNode );
      }

      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        commonModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          commonModel.reset();
          // loop through and reset each scene Node
          for ( let i = 0; i < this.sceneNodes.length; i++ ) {
            this.sceneNodes[ i ].reset();
          }
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'CommonScreenView', CommonScreenView );
} )
;