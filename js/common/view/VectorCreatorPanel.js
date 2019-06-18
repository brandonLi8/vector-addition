// Copyright 2019, University of Colorado Boulder

/**
 * Abstract View for the panel with vectors to drag into the screen. This class is abstract because many of the screens
 * have different types of vector panels functionality/appearance including:
 *  - orientation/appearance of the vector icon
 *  - names of the vector
 *  - number of vectors on the panel
 *  - orientation/appearance of the vector representation (node for the vector when dragging onto the screen)
 *  - infinite number of vectors can be dragged vs. finite
 *  - including a label next to the icon vs not including a label
 *
 * The screens in the simulation respectively must extend this class and provide the abstract methods.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  // const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  // constants
  const SLOTS_SPACING = 20;
  const LABEL_AND_ICON_SPACING = 10;

  // TODO: add a option to put the labels next to the icons
  class VectorCreatorPanel extends Node {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>>} vectorArray - the observable array to add the vector's to.
     * @param {number} numberOfVectorSlots - the number of slots to bring vectors onto the screen
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {Property.<ComponentStyles>} componentStyleProperty
     * @param {VectorTypes} vectorType
     * @param {Object} [options] - the optional arguments for the vector panel
     */
    constructor( vectorArray, numberOfVectorSlots, modelViewTransformProperty, componentStyleProperty, vectorType, options ) {

      options = _.extend( {
        labels: null, // {array.<string>} - array to give a label to the vectors pulled from each slot.
        // Example: labels: ['a', 'b'] would mean that every vector pulled from the first slot would have the 'a' label
        // and every vector pulled from the second slot would have the 'b' label. This length of the array much match
        // the number of vector slots. If labels is null than it doesn't give any vector a label.

        observableArrays: null, // {array.<ObservableArray>} - if provided, this will override the vectorArray (1st argument)
        // This is used when there are multiple observable arrays needed. Example: observableArrays of 2 would mean that
        // every vector pulled from the first slot would be added to the first observableArray in observableArrays.
        // This must be the same length as numberOfVectorSlots if provided

        vectorTypes: null, // {array<VectorType>} - if provided, this will override the vectorType. This is used when
        // there are multiple vectorTypes. Example: vectorTypes" [ '1', '2' ] would mean that every vector pulled from
        // first slot would have vector type 1, and every vector pulled from the second slot would have vector type 2.

        isVectorSlotInfinite: false, // {boolean} - if true, the vector slot will re-add a vector to the slot when removed.

        includeLabelsNextToIcons: true, // {boolean} - if false, the label next to the icon won't appear. 
        // This can only exist if labels is provided.

        panelOptions: null
      }, options );

      // the number of labels has to be the same as the number of slots if provided
      assert && assert( !options.labels || options.labels.length === numberOfVectorSlots,
        'Labels must be the same length as the number of slots.' );

      // the number of observable arrays must equal the number of slots if provided
      assert && assert( !options.observableArrays || options.observableArrays.length === numberOfVectorSlots,
        'Labels must be the same length as the number of slots.' );

      // the number of vector types must equal the number of slots if provided
      assert && assert( !options.vectorTypes || options.vectorTypes.length === numberOfVectorSlots,
        'vectorTypes must be the same length as the number of slots.' );

      super();

      // array for the vector icons to be added
      const slotsChildren = [];

      // container for the vector representations (node for the vector when dragging onto the screen)
      const vectorRepresentationContainer = new Node();

      // loop through each slot
      for ( let slotNumber = 0; slotNumber < numberOfVectorSlots; slotNumber++ ) {

        // create the icon node by calling the abstract method, see createVectorIcon for documentation
        const vectorIconNode = this.createVectorIcon( slotNumber );

        // When the vector icon is clicked, add a vector representation as a decoy vector to drag onto the screen
        vectorIconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {

          // create the decoy vector representation for when the user is dragging the vector onto the screen
          const vectorRepresentationArrow = this.createVectorRepresentationArrow();

          // create a location property to track the location of where the user dragged the vector representation
          const vectorRepresentationLocationProperty = new Vector2Property( this.globalToParentPoint( event.pointer.point ) );

          // create a drag listener for the vector representation node
          const vectorRepresentationDragListener = new DragListener( {
            targetNode: vectorRepresentationArrow,
            translateNode: true,
            locationProperty: vectorRepresentationLocationProperty,
            // TODO: add a drag bounds?
            end: () => {
              // TODO: what should we do if the user dragged it off the grid

              // When the drag has finished, dispose the representation
              vectorRepresentationArrow.dispose();

              // get the drag location
              const vectorRepresentationPosition = modelViewTransformProperty.value.viewToModelPosition(
                vectorRepresentationLocationProperty.value
              );

              // get the default vector components to add to the screen, see getDefaultVectorComponents for documentation
              const defaultVectorComponents = this.getDefaultVectorComponents();

              const vectorModelOptions = options.labels ? {
                label: options.labels[ slotNumber ]
              } : null;
              // Create a new Vector to be added to the observable array
              const newVectorModel = new VectorModel(
                vectorRepresentationPosition,
                defaultVectorComponents.x,
                defaultVectorComponents.y,
                modelViewTransformProperty,
                componentStyleProperty,
                options.vectorTypes ? options.vectorTypes[ slotNumber ] : vectorType,
                vectorModelOptions
              );

              // If there are multiple observable array, use the observableArrays index, otherwise use the given vector array
              const observableVectorArray = options.observableArrays ? options.observableArrays[ slotNumber ] : vectorArray;

              observableVectorArray.push( newVectorModel );

              // Add a removed listener to the observable array to reset the icon
              observableVectorArray.addItemRemovedListener( ( removedVector ) => {
                if ( removedVector === newVectorModel ) {
                  vectorIconNode.visible = true;
                }
              } );
            }
          } );

          vectorRepresentationContainer.addChild( vectorRepresentationArrow );
          vectorRepresentationArrow.addInputListener( vectorRepresentationDragListener );

          if ( !options.isVectorSlotInfinite ) {
            vectorIconNode.visible = false;
          }

          vectorRepresentationArrow.center = this.globalToParentPoint( event.pointer.point );
          vectorRepresentationDragListener.press( event );
        } ) );

        // Create the actual slot, which contains the label (if necessary) and the icon
        const slot = new LayoutBox( {
          orientation: 'horizontal',
          spacing: LABEL_AND_ICON_SPACING
        } );

        // add the icon
        slot.addChild( vectorIconNode );
        // create a node next to the icon for the label
        if ( options.includeLabelsNextToIcons === true ) {
          slot.addChild( new FormulaNode( '\\vec{' + options.labels[ slotNumber ] + '}' ) );
        }

        slotsChildren.push( slot );

      }

      const slotsLayoutBox = new LayoutBox( {
        spacing: SLOTS_SPACING,
        children: slotsChildren
      } );

      const panel = new Panel( slotsLayoutBox, options.panelOptions );

      // TODO: hoist?
      panel.right = 950;
      panel.top = 300;

      this.setChildren( [ panel, vectorRepresentationContainer ] );

    }

    /**
     * @abstract
     * Create an arrow node that is the vector icon
     * @param {number} slotNumber
     * @returns {ArrowNode}
     * @public
     */
    createVectorIcon( slotNumber ) {
      throw new Error( 'createVectorIcon should be implemented in the descendant class' );
    }

    /**
     * @abstract
     * Create an arrow node that is the arrow node when dragging onto the screen (vector representation arrow)
     * @returns {ArrowNode}
     * @public
     */
    createVectorRepresentationArrow() {
      throw new Error( 'createVectorRepresentationArrow should be implemented in the descendant class' );
    }

    /**
     * @abstract
     * Get the default vector components for when the vector is released onto the graph (model coordinates)
     * @returns {Vector2}
     * @public
     */
    getDefaultVectorComponents() {
      throw new Error( 'getDefaultVectorComponents should be implemented in the descendant class' );
    }

  }

  return vectorAddition.register( 'VectorCreatorPanel', VectorCreatorPanel );
} );

