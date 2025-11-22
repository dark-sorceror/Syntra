from setuptools import setup, find_packages

setup(
    name = 'Syntra Backend',
    version = '0.1.0',
    packages = find_packages(
        include=[
            'src', 
            'src.*'
        ]
    )
)