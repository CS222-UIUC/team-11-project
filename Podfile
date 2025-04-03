# platform :ios, '12.0'
# target 'Shelp' do
#   use_frameworks!
#   pod 'React'
#   pod 'React-Core'
#   pod 'gRPC-C++'
# end
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

# Enable static frameworks for Firebase
use_frameworks! :linkage => :static

target 'Shelp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # Add Firebase pods
  pod 'Firebase/Core'
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'
  pod 'GoogleSignIn', '~> 7.0'

  # Optional: Add gRPC-C++ if needed
  # pod 'gRPC-C++'

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # :ccache_enabled => true
    )
  end
end