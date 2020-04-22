const net = require( 'net' )
const fs = require( 'fs' )
const wordList = require( '../sources/words')

const port = 3214
const streamRate = 100

let intervalRef
const server = net.createServer( ( socket ) => {

  socket.on( 'data', ( data ) => {
    console.log( data.toString() )
  } )

  socket.write( 'STREAMER: Initialized socket connection.\n' )

  intervalRef = setInterval( () => writeRandomElement( socket ), streamRate )

} ).on( 'error', ( err ) => {
  console.error( err )
  clearInterval( intervalRef )
} )

server.listen( port, () => {
  console.log( `STREAMER: Opened socket server on port ${port}.\n` )
} )

function writeRandomElement( socket ) {
  const randLength = getRandInt( 10 )
  const randList = []

  for( let i = 0; i < randLength; i++ ) {
      const randIdx = getRandInt( wordList.length )
      randList.push( wordList[randIdx] )
  }

  randSentence = randList.join( ' ' )

  if ( randSentence.length ) {
    const data = { data : randSentence, timestamp : Date.now() }
    socket.write( JSON.stringify( data ) )
  }
}

function getRandInt( max ) {
  return  Math.floor( Math.random() * Math.floor( max ) )
}
