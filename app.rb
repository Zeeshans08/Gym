require 'sinatra'
require 'json'

# Mock user database
USERS = {
  'user@example.com' => {
    password: 'securepassword123',
    name: 'John Doe',
    membership: 'premium'
  }
}.freeze

set :port, 3000

before do
  content_type 'application/json'
  headers 'Access-Control-Allow-Origin' => '*',
          'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST'],
          'Access-Control-Allow-Headers' => 'Content-Type'
end

options '*' do
  200
end

post '/login' do
  data = JSON.parse(request.body.read)
  email = data['email']
  password = data['password']

  if USERS.key?(email) && USERS[email][:password] == password
    {
      success: true,
      message: 'Login successful',
      user: {
        name: USERS[email][:name],
        membership: USERS[email][:membership]
      }
    }.to_json
  else
    status 401
    {
      success: false,
      message: 'Invalid email or password'
    }.to_json
  end
end

post '/contact' do
  data = JSON.parse(request.body.read)
  name = data['name']
  email = data['email']
  subject = data['subject']
  message = data['message']

  # In a real app, you would save this to a database
  puts "New contact form submission: #{name} <#{email}> - #{subject}: #{message}"

  {
    success: true,
    message: "Thank you for your message! We'll get back to you soon."
  }.to_json
end