import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://ajeezinbkzdtshjttcmf.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)

async function createTables() {
  console.log('Creating database tables...')
  
  const sqlContent = fs.readFileSync(path.join(process.cwd(), 'scripts', 'create-tables.sql'), 'utf8')
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.log('Tables might already exist or using direct SQL execution...')
      // Try to create tables using direct SQL
      const { error: createSongError } = await supabase
        .from('Song')
        .select('id')
        .limit(1)
      
      if (createSongError && createSongError.code === 'PGRST116') {
        console.log('Song table does not exist. Please create the tables manually in Supabase SQL editor using the create-tables.sql file.')
        return false
      }
    }
    
    console.log('✅ Tables created successfully or already exist')
    return true
  } catch (error) {
    console.log('⚠️ Could not execute SQL directly. Please create tables manually in Supabase SQL editor.')
    console.log('Use the SQL from scripts/create-tables.sql')
    return false
  }
}

async function main() {
  console.log('Setting up database...')
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_KEY environment variable is not set')
    process.exit(1)
  }
  
  const tablesCreated = await createTables()
  
  if (tablesCreated) {
    console.log('🎉 Database setup complete! You can now run the song import script.')
    console.log('Run: pnpm tsx scripts/add-songs-supabase.ts')
  } else {
    console.log('📝 Please create the tables manually in Supabase SQL editor first.')
    console.log('Then run: pnpm tsx scripts/add-songs-supabase.ts')
  }
}

main()
  .catch((e) => {
    console.error('Script failed:', e)
    process.exit(1)
  }) 