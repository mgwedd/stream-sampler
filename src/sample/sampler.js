const net = require( 'net' )
const fs = require( 'fs' )

const port = 3214

const logStream = fs.createWriteStream(__dirname + '/log/log.txt')

const sampler = net.createConnection({ port }, () => {
  console.log( `SAMPLER: Connected to stream simulator on port ${port}`)
})

class ReservoirSampler {

  constructor( opts ) {
    this.reservoir = []
    this.i = 0
    this.k = opts.k
    this.logStream = logStream
  }

  getRandInt( max ) {
    return  Math.floor( Math.random() * Math.floor( max ) )
  }

  process( data ) {

    if ( this.i < this.k ) {
      this.fill( data )
    } else {
      this.sample( data )
    }

    this.logStream.write( `${this.i}: ${data}\n` )
    console.log( 'Processed stream element >', data, 'New Reservoir: ', this.reservoir )
  }

  fill( data ) {
      this.reservoir[this.i] = data
      this.i++
  }

  sample( data ) {
    const j = this.getRandInt( this.i + 1 )

    if( j < this.k ) {
      this.reservoir[j] = data
    }
    this.i++
  }

}

const reservoirSampler = new ReservoirSampler( {
  k : 10,
  logStream,
} )

sampler.on( 'data', ( data ) => {
  // console.log( `SAMPLER: received data > ${data.toString()}` )
  reservoirSampler.process( data.toString() )
  // sampler.end()
} )

sampler.on( 'end', () => {
  console.log( 'SAMPLER: disconnected from stream simulator' )
} )


