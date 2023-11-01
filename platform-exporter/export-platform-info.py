import subprocess
import platform
import psutil

def export_platform_info():
    # The Push Gateway URL
    pushgateway_url = 'http://pushgateway:9091'

    # The job name
    job = 'platform-info-job'

    # Get the number of logical CPUs (including hyperthreaded cores)
    num_logical_cpus = psutil.cpu_count(logical=True)

    # Get the number of physical CPUs
    num_physical_cpus = psutil.cpu_count(logical=False)
    
    # Get RAM in bytes
    ram_info = psutil.virtual_memory()

    # Prepare the metric data
    metric_data = f'platform_info{{system="{platform.system()}", release="{platform.release()}", architecture="{platform.architecture()[0]}", arch_linkage="{platform.architecture()[1]}", machine="{platform.machine()}", node="{platform.node()}", num_logical_cpus="{num_logical_cpus}", num_physical_cpus="{num_physical_cpus}", total_ram="{ram_info.total}" }} 1'

    # Use subprocess to execute the curl command
    cmd = f'echo \'{metric_data}\' | curl --data-binary @- {pushgateway_url}/metrics/job/{job}'
    subprocess.run(cmd, shell=True, stdout=subprocess.PIPE)

    return metric_data

if __name__ == '__main__':
    export_platform_info()
