routers = dict(
  BASE = dict(
    default_application = 'dhildebr',
    map_hyphen = True,
  ),
  
  dhildebr = dict(
    default_controller = 'default',
    default_function = 'index',
    functions = dict(
      default=['index', 'skills', 'projects', 'children_of_ase', 'rosetta_run', 'contact'],
    ),
  ),
)
