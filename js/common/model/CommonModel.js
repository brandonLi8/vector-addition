// Copyright 2019, University of Colorado Boulder

/**
 * Common model is the shared model for every screen respectively. Its main responsibility is to control the state
 * of the simulation.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
 
  // constants
  const DEFUALT_VECTOR_ORIENTATION = VectorAdditionConstants.DEFUALT_VECTOR_ORIENTATION;
  const DEFAULT_COMPONENT_STYLE = VectorAdditionConstants.DEFAULT_COMPONENT_STYLE;


  // @abstract
  class CommonModel {

    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {Property.<VectorOrientation>}
      this.vectorOrientationProperty = new Property( DEFUALT_VECTOR_ORIENTATION );

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, DEFAULT_COMPONENT_STYLE );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // the Graph model(s) is instantiated in each model respectively to support multiple screens
      // this is an abstract method, see instantiateGraphs for documentation
      this.instantiateGraphs();
    }

    /**
     * @public
     * Reset the common model.
     */
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();

      // reset the graph(s) (abstract method)
      this.resetGraphs();
    }

    /**
     * @abstract
     * @public
     * Create the graph model(s) (1D has 2 graph scenes)
     */
    instantiateGraphs() {
      throw new Error( 'instantiateGraphs is an abstract method and must be implemented' );
    }

    /**
     * @abstract
     * @public
     * Reset the graphs to their initial states respectively
     */
    resetGraphs() {
      throw new Error( 'resetGraphs is an abstract method and must be implemented' );
    }

  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );