Vagrant.configure(2) do |config|

    config.vm.box = "ubuntu/trusty64"
    config.vm.hostname = "officer"

    config.vm.network "forwarded_port", guest: 80, host: 8080
    config.vm.network "forwarded_port", guest: 9200, host: 9200

    config.vm.synced_folder "./", "/vagrant/"

    config.vm.provider "virtualbox" do |v|
        v.name = "officer"
        v.customize ["modifyvm", :id, "--memory", "2048"]
    end

    config.vm.provision "shell" do |s|
         	s.path = "./provision/setup.sh"
    end
end
